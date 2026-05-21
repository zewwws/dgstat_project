from django import template
from django.utils.html import escape
from django.utils.safestring import mark_safe

register = template.Library()

@register.filter
def nl2br(value):
    if not value:
        return value
    return mark_safe(escape(str(value)).replace('\n', '<br>').replace('\r', ''))