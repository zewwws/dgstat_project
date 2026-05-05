import os
import json

from django.http import HttpResponseRedirect, JsonResponse
from django.conf import settings
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt

from .forms import UploadFileForm
from .models import TrimesterSnapshot

  
def get_latest_file(request):
    upload_dir = os.path.join(settings.MEDIA_ROOT, 'uploads')
    
    # Get the list of files in the upload directory
    files = os.listdir(upload_dir)
    
    # Sort the files by modification time (most recent first)
    files = sorted(files, key=lambda x: os.path.getmtime(os.path.join(upload_dir, x)), reverse=True)
    
    if files:
        latest_file = files[0]  # The most recent file
        return JsonResponse({'file_name': latest_file})
    else:
        return JsonResponse({'error': 'No files found in the uploads folder'})

def upload_file(request):
    uploaded_file_path = None
    file_name = None

    if request.method == 'POST' and request.FILES.get('file_field'):
        form = UploadFileForm(request.POST, request.FILES)
        if form.is_valid():
            file = request.FILES['file_field']

            upload_dir = os.path.join(settings.MEDIA_ROOT, 'uploads')
            os.makedirs(upload_dir, exist_ok=True)

            # Delete previous file if exists
            old_path = request.session.get('uploaded_file_path')
            print(f"OLD PATH FROM SESSION: {old_path}")
            print(f"FILE EXISTS: {os.path.exists(old_path) if old_path else 'no path in session'}")

            if old_path and os.path.exists(old_path):
                os.remove(old_path)
                print(f"DELETED: {old_path}")
            else:
                print("NOTHING TO DELETE")

            # Clear all session data from previous upload
            request.session.flush()

            # Save new file
            file_path = os.path.join(upload_dir, file.name)
            with open(file_path, 'wb+') as destination:
                for chunk in file.chunks():
                    destination.write(chunk)

            request.session['uploaded_file_path'] = file_path
            file_name = os.path.basename(file_path)

            return HttpResponseRedirect('/upload/')

    else:
        form = UploadFileForm()

    return render(request, 'upload_file.html', {
        'form': form,
        'uploaded_file_name': file_name,
    })


QUARTER_ORDER = ['Q1', 'Q2', 'Q3', 'Q4']

def get_previous_trimester_key(trimester_key):
    # "Q2-2024" → "Q1-2024", "Q1-2024" → "Q4-2023"
    quarter, year = trimester_key.split('-')
    year = int(year)
    idx = QUARTER_ORDER.index(quarter)
    if idx == 0:
        return f"Q4-{year - 1}"
    return f"{QUARTER_ORDER[idx - 1]}-{year}"

@csrf_exempt
def save_trimester_snapshot(request):
    print("METHOD:", request.method)
    if request.method != 'POST':
        return JsonResponse({'error': 'POST only'}, status=405)

    body = json.loads(request.body)
    print("BODY:", json.dumps(body, indent=2))
    trimester_key = body.get('trimester')   # e.g. "Q1-2024"
    snapshots = body.get('snapshots')       # list of { materia, pendenti_iniziali, pendenti_finali }

    warnings = []
    prev_key = get_previous_trimester_key(trimester_key)

    for snap in snapshots:
        materia = snap['materia']
        pendenti_iniziali = snap['pendenti_iniziali']
        pendenti_finali = snap['pendenti_finali']

        # Validate against previous trimester if it exists
        try:
            prev = TrimesterSnapshot.objects.get(trimester=prev_key, materia=materia)
            if prev.pendenti_finali != pendenti_iniziali:
                warnings.append({
                    'materia': materia,
                    'message': f"Mismatch: pendenti_finali {prev_key} = {prev.pendenti_finali}, "
                               f"pendenti_iniziali {trimester_key} = {pendenti_iniziali}"
                })
        except TrimesterSnapshot.DoesNotExist:
            pass  # seed trimester, no validation needed

        # Save or update
        TrimesterSnapshot.objects.update_or_create(
            trimester=trimester_key,
            materia=materia,
            defaults={
                'pendenti_iniziali': pendenti_iniziali,
                'pendenti_finali': pendenti_finali,
            }
        )

    return JsonResponse({
        'status': 'saved',
        'trimester': trimester_key,
        'warnings': warnings  # empty list = all good
    })