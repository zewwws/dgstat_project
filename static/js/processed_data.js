// Data will be stored here after upload
let startDate
let endDate
document.addEventListener('DOMContentLoaded', function() {
    let filtereData = [];
    function convertTimeFormat(timeString) {
        // Parse the time string into a Date object
        const dateObj = new Date(timeString);
      
        // Format the date to YYYYMMDD
        const year = dateObj.getFullYear();
        const month = String(dateObj.getMonth() + 1).padStart(2, '0'); // Months are 0-based, so add 1
        const day = String(dateObj.getDate()).padStart(2, '0');
      
        return `${year}${month}${day}`;
    }

    function convertMMDDYYYYToISO(dateStr) {
        if (typeof dateStr === 'string') {
            const parts = dateStr.split('/');
            if (parts.length === 3) {
                let year = parts[2];
                if (year.length === 2) {
                    // Convert 2-digit year to 4-digit year
                    year = year > 50 ? `19${year}` : `20${year}`;
                }
                const month = parts[0].padStart(2, '0'); // Ensure 2-digit month
                const day = parts[1].padStart(2, '0');   // Ensure 2-digit day
                return `${year}-${month}-${day}`;       // ISO format yyyy-mm-dd
            } else {
                console.error('Invalid date string, expected mm/dd/yyyy format:', dateStr);
                return null;
            }
        } else {
            console.error('Invalid date type:', dateStr);
            return null;
        }
    }

    let filteredData = [];
    let allData = [];  // Store the entire dataset
    let trimester = [];
    // Filter button event listener
    document.getElementById('filter_button').addEventListener('click', function() {
        const startDate = new Date(document.getElementById('start_date').value);
        const endDate = new Date(document.getElementById('end_date').value);

        fetch('/get_latest_file/')
        .then(response => response.json())
        .then(data => {
            if (data.file_name) {
                const filePath = `/media/uploads/${data.file_name}`;
                fetch(filePath)
                    .then(response => response.arrayBuffer())
                    .then(arrayBuffer => {
                        const workbook = XLSX.read(arrayBuffer, { type: 'array' });
                        const sheet = workbook.Sheets[workbook.SheetNames[0]];
                        const rows = XLSX.utils.sheet_to_json(sheet, {
                            header: 1,
                            defval: '',
                            raw: false
                        });

                        const headers = rows[0] || [];
                        allData = rows.slice(1).map(row => {
                            return headers.reduce((acc, header, index) => {
                                acc[header] = row[index] || '';
                                return acc;
                            }, {});
                        });

                        console.log("✅ All Data Loaded:", allData.length, "rows");

                        // Filter rows based on "CONCLUSO" date column
                        filteredData = allData.filter(row => {
                            const concluso = row['CONCLUSO'];
                            if (!concluso) return false;

                            const rowDate = new Date(convertMMDDYYYYToISO(concluso));
                            if (isNaN(rowDate.getTime())) {
                                console.warn('Skipping row due to invalid date:', row, concluso);
                                return false;
                            }

                            return rowDate >= startDate && rowDate <= endDate;
                        });

                        console.log("✅ Filtered Data Loaded:", filteredData.length, "rows");

                        trimester = { startDate: startDate, endDate: endDate };

                        displayFilteredData(filteredData);
                    })
                    .catch(error => {
                        console.error('❌ Error fetching or parsing Excel file:', error);
                    });
            }
        })
        .catch(error => {
            console.error('❌ Error loading the file:', error);
        });
    });

    function displayFilteredData(filteredData) {
        const tableBody = document.querySelector('#filtered_data_table tbody');
        const tableHeader = document.querySelector('#filtered_data_table thead');
    
        // Clear the current table content
        tableBody.innerHTML = '';
        tableHeader.innerHTML = '';
    
        if (filteredData.length === 0) {
            const row = document.createElement('tr');
            const cell = document.createElement('td');
            cell.colSpan = "100%"; // Span across all columns for better visibility
            cell.textContent = 'No data found for the selected date range';
            row.appendChild(cell);
            tableBody.appendChild(row);
            return;
        }
    
        const allKeys = Array.from(new Set(filteredData.flatMap(row => Object.keys(row))));
        // Generate table headers from the first row of filtered data
        const headerRow = document.createElement('tr');
        allKeys.forEach(key => {
            const th = document.createElement('th');
            th.textContent = key;
            headerRow.appendChild(th);
        });
        
        tableHeader.appendChild(headerRow);
    
        // Populate the table with filtered data
        filteredData.forEach(row => {
            const tr = document.createElement('tr');
            allKeys.forEach(key => {
                const td = document.createElement('td');
                let cellContent = row[key];

                // Handle the case for missing or invalid values
                if (cellContent === null || cellContent === undefined || cellContent === '') {
                    cellContent = ''; // Empty cell
                } else if (key === 'AVVIATO' || key === 'CONCLUSO') {
                    // Convert Excel serial numbers to readable dates if applicable
                    cellContent = row[key] ? convertMMDDYYYYToDDMMYYYY(row[key]) : '';
                }

                td.textContent = cellContent;
                tr.appendChild(td);
            });
            tableBody.appendChild(tr);
        });
    }  

    // Define processData in global scope so it's available to both handlers
    function processData(filtered) {
        
        return filtered.map(row => {
            const [campo42, campo43] = campo42_43(row);
            const campi_12_27 = processCampi_12_27(row);
            return {
                campo01: "V.7.0",
                campo02: "MediazioniSchede",
                campo03: codice_sede,  // global variable
                campo04: convertTimeFormat(trimester.startDate),
                campo05: convertTimeFormat(trimester.endDate),
                campo06: campo06(row),
                campo07: campo07(row),
                campo08: campo08(row),
                campo09: campo09(row),
                campo10: campo10(row),
                campo11: campo11(row),
                campo12: campi_12_27.campo12,
                campo13: campi_12_27.campo13,
                campo14: campi_12_27.campo14,
                campo15: campi_12_27.campo15,
                campo16: campi_12_27.campo16,
                campo17: campi_12_27.campo17,
                campo18: campi_12_27.campo18,
                campo19: campi_12_27.campo19,
                campo20: campi_12_27.campo20,
                campo21: campi_12_27.campo21,
                campo22: campi_12_27.campo22,
                campo23: campi_12_27.campo23,
                campo24: campi_12_27.campo24,
                campo25: campi_12_27.campo25,
                campo26: campi_12_27.campo26,
                campo27: campi_12_27.campo27,

                campo28: campo28(row),
                campo29: campo29(row),
                campo30: campo30(row),
                campo31: campo31(row),
                campo32: campo32(row),
                campo33: campo33(row),
                campo34: campo34(row),
                campo35: campo35(row),
                campo36: campo36(row),
                campo37: campo37(row),
                campo38: campo38(row),
                campo39: campo39(row),
                campo40: campo40(row),
                campo41: campo41(row),
                campo42: campo42,
                campo43: campo43
            };
        });
    }

    // Process Data button event listener
    document.getElementById('process_data').addEventListener('click', function() {
        if (!filteredData || filteredData.length === 0) {
            console.error("No filtered data available. Please run the filter process first.");
            return;
        }
        const processedData = processData(filteredData);
       
        console.log('Processed Data:', processedData);
        generateCSV(processedData, trimester);
    });

    function convertMMDDYYYYToDDMMYYYY(dateStr) {
        if (typeof dateStr === 'string') {
            const parts = dateStr.split('/');
            if (parts.length === 3) {
                // Ensure the date is in the expected format (mm/dd/yyyy or mm/dd/yy)
                const month = parts[0].padStart(2, '0'); // Ensure 2-digit month
                const day = parts[1].padStart(2, '0');   // Ensure 2-digit day
                let year = parts[2];
    
                // Convert 2-digit year to 4-digit year if necessary
                if (year.length === 2) {
                    year = year > 50 ? `19${year}` : `20${year}`;
                }
    
                return `${day}/${month}/${year}`; // dd/mm/yyyy format
            } else {
                console.error('Invalid date string, expected mm/dd/yyyy format:', dateStr);
                return null;
            }
        } else {
            console.error('Invalid date type:', dateStr);
            return null;
        }
    }

    //codice dgstat del organismo
    function generateCodiceSede(org_code) {
        let codice_sede;

        if (org_code.length === 3) {
            codice_sede = '800' + org_code;  // If 3 digits, prefix with '800'
        } else if (org_code.length === 4) {
            codice_sede = '80' + org_code;   // If 4 digits, prefix with '80'
        } else {
            console.error("Organization code must be 3 or 4 digits");
            return null;
        }
        return codice_sede;
    }

    let org_code = '921'; 
    const codice_sede = generateCodiceSede(org_code);

    function campo06(row) {
        // Convert AVVIATO to dd (day only) and extract the year (yy)
        const avviatoParts = row['AVVIATO'].split('/');
        const month = avviatoParts[0];  // Get the month part
        const day = avviatoParts[1];    // Get the day part
        const year = avviatoParts[2];   // Get the year part (yy)

        // Return the combination of MED and year (yy)
        return `${String(row['MED']).padStart(4, '0')}/${year}`;
    }

    function transformDate(dateString) {
        // Split the date string into parts (mm, dd, yy)
        const dateParts = dateString.split('/');
        
        // Extract the month, day, and year parts
        const month = dateParts[0];
        const day = dateParts[1];
        const year = '20' + dateParts[2]; // Assuming 'yy' is from 2000 onward
        
        // Return the formatted date as yyyymmdd
        return `${year}${month.padStart(2, '0')}${day.padStart(2, '0')}`;
    }

    function formatDate(date) {
        const d = String(date.getDate()).padStart(2, '0');
        const m = String(date.getMonth() + 1).padStart(2, '0');
        const y = date.getFullYear();
        return `${d}/${m}/${y}`;
    }

    function campo07(row) {
        const avviatoDate = new Date(row['AVVIATO']);
        return formatDate(avviatoDate);
    }

    function campo08(row, startDate, endDate) {
        const avviatoDate = new Date(row['AVVIATO']);
        const conclusoDate = new Date(row['CONCLUSO']);
        const startDateObj = new Date(startDate);
        const endDateObj = new Date(endDate);

        if (conclusoDate < avviatoDate) {
            return "Error: CONCLUSO must be greater than AVVIATO";
        }

        if (conclusoDate < startDateObj || conclusoDate > endDateObj) {
            return "Error: CONCLUSO must be within selected trimester";
        }

        return formatDate(conclusoDate);
    }

    function campo09(row) {
        if (row['ESITO'] === 'ACCORDO') {
            return '1';
        } else {
            return '2';
        }
    }

    function campo10(row) {
        if (row['P.M.'] === 'No') {
        return '1';
        } else if (row['P.M.'] === 'P') {
        return '2';
        } else if (row['P.M.'] === 'M') {
        return '3';
        } else {
        // Default case for any other value
        return '2';
        }
    }
    

    function campo11(row) {
        const categoriaMapping = {
            '1': 'VOL',
            '3': 'OBLIG COND PROC',
            '4': 'OBLIG CONTR',
            '5': 'OBLIG GENERALE',
            '6': 'GIUD IMPROCED',
            '7': 'GIUD MAT NON OB'
        };
        return categoriaMapping[row['CATEGORIA']] || '3';
    }


    function campo41(row) {
        return row['INC.RI'];
    }

    // campo42_43: Based on V.CONF column
    function campo42_43(row) {
        const vConf = row['V.CONF'];
        
        if (vConf === 'V') {
        return ['1', '2'];
        } else if (vConf === 'M') {
        return ['2', '1'];
        } else if (vConf === 'P' || vConf === null || vConf === undefined) {
        return ['2', '2'];
        } else {
        // Default return for any other case
        return ['2', '2'];
        }
    }
  
  
    function processCampi_12_27(row) {
        const parti = row['PARTI'];
    
        const societaCapitali = ['SPA', 'SAPA', 'SRL', 'SRLS'];
        const societaPersone = ['SNC', 'SAS', 'SS', 'SRLS'];
        const associazioniKeywords = [
            'Fondazione', 'Associazione', 'ONLUS', 'Cooperativa',
            'Culturale', 'Sportiva', 'Volontariato', 'Sociale'
        ];
        const altroKeywords = [
            'CONDOMINIO', 'COMUNE', 'REGIONE', 'Provincia', 'Università', 'Istituto', 'INPS', "UNIVERSITA'", 'METROPOLITANA', "CITTA'"
        ];
    
        const entriesNumbered = parti.split(/\d+\.\s/).filter(entry => entry.trim());
    
        const campo = {
            campo12: 0,
            campo13: 0,
            campo14: 0,
            campo15: 0,
            campo16: 0,
            campo17: 0,
            campo18: 0,
            campo19: 0,
            campo20: 0,
            campo21: "2",
            campo22: 0,
            campo23: 0,
            campo24: 0,
            campo25: 0,
            campo26: 0,
            campo27: 0
        };
    
        entriesNumbered.forEach(entry => {
            const hasIstante = entry.includes("ISTANTE");
            const hasAderente = entry.includes("ADERENTE");
            const hasInvitata = entry.includes("INVITATA");
            const hasAvv = entry.includes("AVV.");
    
            if (hasIstante) {
                // Always count the ISTANTE entry.
                campo.campo12++;
                if (hasAvv) campo.campo18++;
            
                // Use an if/else if chain to ensure only one category is applied.
                if (includesAnyWholeWord(entry, altroKeywords)) {
                    // Prioritize entries that match altrokewords (e.g., "CONDOMINIO")
                    campo.campo17++;
                } else if (includesAnyWholeWord(entry, societaCapitali)) {
                    campo.campo13++;
                } else if (includesAnyWholeWord(entry, societaPersone)) {
                    campo.campo14++;
                } else if (includesAnyWholeWord(entry, associazioniKeywords)) {
                    campo.campo15++;
                } else {
                    // Default case: if no keywords match, you could assign it to another field (e.g., campo16)
                    campo.campo16++;
                }
            }


            if (row['ESITO'] === 'RINUNCIA') {
                campo.campo19 = campo.campo12;
            }
    
            // ALWAYS count both independently of mode
            if (hasAderente) {
                campo.campo20++;
            }

            if (hasInvitata) {
                campo.campo20++;
            }


            // ADERENTE MODE ONLY (extra logic)
            if (hasAderente) {

                campo.campo21 = "1";

                if (hasAvv) {
                    campo.campo27++;
                }

                // classification only when ADERENTE exists
                if (includesAnyWholeWord(entry, altroKeywords)) {
                    campo.campo26++;
                } else if (includesAnyWholeWord(entry, societaCapitali)) {
                    campo.campo22++;
                } else if (includesAnyWholeWord(entry, societaPersone)) {
                    campo.campo23++;
                } else if (includesAnyWholeWord(entry, associazioniKeywords)) {
                    campo.campo24++;
                } else {
                    campo.campo25++;
                }
            }
            
        });
    

    
        // Compute the sum of campo13 through campo17.
        const sum13to17 = campo.campo13 + campo.campo14 + campo.campo15 + campo.campo16 + campo.campo17;
    
        if (sum13to17 > 0 && campo.campo12 < sum13to17) {
            console.log("Debug Error: Campo12 validation failed");
            console.log("Row PARTI:", parti);
            console.log("Entries Numbered:", entriesNumbered);
            console.log("Computed Fields:", {
                campo12: campo.campo12,
                campo13: campo.campo13,
                campo14: campo.campo14,
                campo15: campo.campo15,
                campo16: campo.campo16,
                campo17: campo.campo17,
                sum13to17: sum13to17
            });
            
            // Create the error message string
            const errorMessage = `Invalid campo12: ${campo.campo12}. It must be at least ${sum13to17} (sum of campo13-campo17) when ISTANTE entries are present.`;
            
            // Log the error message string to the console
            console.log("Error Message:", errorMessage);
            
            // Throw the error with the message
            throw new Error(errorMessage);
        }
        if (campo.campo18 > campo.campo12) {
            console.log("Debug Error: Campo18 validation failed");
            console.log("Computed Fields:", { campo18: campo.campo18, campo12: campo.campo12 });
            throw new Error(`Invalid campo18: ${campo.campo18}. It cannot be greater than campo12: ${campo.campo12}.`);
        }
    
        // Compute the sum of campo22 through campo26.
        const sum22to26 = campo.campo22 + campo.campo23 + campo.campo24 + campo.campo25 + campo.campo26;
    
        if (sum22to26 > 0 && campo.campo20 < sum22to26) {
            console.log("Debug Error: Campo20 validation failed");
            console.log("Row PARTI:", parti);
            console.log("Entries Numbered:", entriesNumbered);
            console.log("Computed Fields:", {
                campo20: campo.campo20,
                campo22: campo.campo22,
                campo23: campo.campo23,
                campo24: campo.campo24,
                campo25: campo.campo25,
                campo26: campo.campo26,
                sum22to26: sum22to26
            });
            
            const errorMessage = `Invalid campo20: ${campo.campo20}. It must be at least ${sum22to26} (sum of campo22-campo26).`;
            
            // Log the error message string to the console
            console.log("Error Message:", errorMessage);
            
            // Delay throwing the error so logs get flushed
            setTimeout(() => {
                throw new Error(errorMessage);
            }, 0);
        }
        
        if (campo.campo27 > campo.campo20) {
            console.log("Debug Error: Campo27 validation failed");
            console.log("Computed Fields:", { campo27: campo.campo27, campo20: campo.campo20 });
            throw new Error(`Invalid campo27: ${campo.campo27}. It cannot be greater than campo20: ${campo.campo20}.`);
        }
    
        return campo;
    }
    
    function includesAnyWholeWord(text, keywords) {
        const words = text.toUpperCase().split(/[\s,.;()]+/);
        return keywords.some(keyword => words.includes(keyword.toUpperCase()));
    }
    

    // campo28: "SEDE" (Convert sigla to codice)
    function campo28(row) {
        const codiceDict = {
            'RC': '81',
            'TO': '96'
        };
        const sigla = row['SEDE'];
        return codiceDict[sigla] || 'Unknown';
    }

    // campo29: "SEDE" (same logic as campo28 but for circondario)
    function campo29(row) {
        const codiceCircondarioDict = {
            'RC': '16114',
            'TO': '16142'
        };
        const sigla = row['SEDE'];
        return codiceCircondarioDict[sigla] || 'Unknown';
    }

    // campo30: MATERIA, map from VALORE
    function campo30(row) {
        const materiaMapping = {
            'Condominio': '1',
            'Diritti reali': '2',
            'Divisione': '3',
            'Successioni': '4',
            'Patti di famiglia': '5',
            'Locazione': '6',
            'Comodato': '7',
            'Affitto di aziende': '8',
            'Responsabilità medica': '10',
            'Difamazione': '11',
            'Contratti assicurativi': '12',
            'Contratti bancari': '13',
            'Contratti finanziari': '14',
            'Altro': '15',
            'Associazione in partecipazione': '31',
            'Consorzio': '32',
            'Franchising': '33',
            "Contratto d'Opera": '34',
            'Contratti di rete': '35',
            'Contratti di somministrazione': '36',
            'Società di persone': '38',
            'Contratti di subfornitura': '39'
        };
        return materiaMapping[row['MATERIA']] || 'Unknown';
    }

    // campo31: If "MATERIA" is '15' (Altra natura), set it to NOTE value, else 0
    function campo31(row) {
        return row['MATERIA'] === 'Altro' ? row['NOTE'] : '';
    }

    // campo32: "VALORE", format values as required
    function campo32(row) {
        const value = row['VALORE'];
        if (value === 'Variabile' || value === 'Indeterminato') {
            return '0,00';
        }

        // Handle range formatting
        const ranges = {
            'Fino 1.000': '500,00',
            '1.001 - 5.000': '3000,50',
            '5.001 - 10.000': '7500,50',
            '10.001 - 25.000': '17500,50',
            '25.001 - 50.000': '37500,50',
            '50.001 - 150.000': '100000,50',
            '150.001 - 250.000': '200000,50',
            '250.000 - 500.000': '375000,00',
            '500.001 - 2.500.000': '1500000,50',
            '2.500.000 - 5.000.000': '3750000,00',
            'oltre 5.000.000': '5000.001,00'
        };
        
        return ranges[value] || '0';
    }

    function parseAmount(value) {
        if (!value) return 0;
        let str = value.toString().replace(/€\s*/g, '').trim();
        str = str.replace(/,/g, ''); // remove thousand commas → 1042.40
        return parseFloat(str) || 0;
    }

    function formatCurrency(value) {
        return value.toFixed(2).replace('.', ',');
    }

    function calcTotal(row) {
        return formatCurrency(parseAmount(row['SM']) + parseAmount(row['S.AVV.']));
    }

    function campo33(row) {
        const total = parseAmount(row['SM']) + parseAmount(row['S.AVV.']);
        return total ? formatCurrency(total) : '0,00';
    }

    function campo34(row) {
        const esito = row['ESITO'];
        const isValid = esito !== 'MANCATA ADESIONE' && 
                        !(esito === 'RINUNCIA' && row['INC.RI'] == 1);

        return (isValid) ? calcTotal(row) : '0,00';
    }

    function campo35(row) {
        const esito = row['ESITO'];
        const isValid = esito === 'ACCORDO' || 
                        (esito === 'MANCATO ACCORDO' && row['INC.RI'] > 1);

        return isValid ? calcTotal(row) : '0,00';
    }

    function campo36(row) {
        const esito = row['ESITO'];
        const isValid = esito === 'ACCORDO' || 
                        (esito === 'MANCATO ACCORDO' && row['INC.RI'] > 1);

        return isValid ? calcTotal(row) : '0,00';
    }

    function campo37(row) {
        const result = row['CENTRI'].split('/')[0];
        return result === '0' ? '0' : result;
    }

    function campo38(row) {
        if (!row['CENTRI'] || !row['CENTRI'].includes('/')) return '';
        const parts = row['CENTRI'].split('/');
        const result = parts[1] || '';
        return result === '0' ? '0' : result;
    }

    function campo39(row) {
        // Extract the number from "GP-ISTANTE-n" pattern in the NOTE column using regex
        const match = row['NOTE'].match(/GP-ISTANTE-(\d+)/);
        return match ? match[1] : 0;
    }

    function campo40(row) {
        // Extract the number from "GP-ADERENTE-n" pattern in the NOTE column using regex
        const match = row['NOTE'].match(/GP-ADERENTE-(\d+)/);
        return match ? match[1] : 0;
    }


    // Helper to figure out which quarter a date belongs to:
    function getQuarterFromDate(dateObj) {

        const month = dateObj.getMonth() + 1; // months are 0-based in JS
        if (month <= 3)  return 1;  // Q1
        if (month <= 6)  return 2;  // Q2
        if (month <= 9)  return 3;  // Q3
        return 4;                   // Q4
    }

    function getQuarterAndYearFromDate(dateObj) {
        const month = dateObj.getMonth() + 1; // months are 0-based in JS
        let quarter;
        if (month <= 3) {
            quarter = 1; // Q1
        } else if (month <= 6) {
            quarter = 2; // Q2
        } else if (month <= 9) {
            quarter = 3; // Q3
        } else {
            quarter = 4; // Q4
        }
        const year = dateObj.getFullYear();
        const shortYear = String(year).slice(-2);
        return `T${quarter}/${shortYear}`;
    }
    
    function generateCSV(processedData, trimester) {
        // Step 1: Define the header (campo1, campo2, ..., campo43)
        const headers = [
            "campo01", "campo02", "campo03", "campo04", "campo05", "campo06", "campo07", 
            "campo08",  "campo09", "campo10", "campo11", "campo12", "campo13", "campo14", 
            "campo15", "campo16", "campo17", "campo18","campo19", "campo20", "campo21", 
            "campo22", "campo23", "campo24", "campo25", "campo26", "campo27","campo28", 
            "campo29", "campo30", "campo31", "campo32", "campo33", "campo34", "campo35", 
            "campo36", "campo37", "campo38", "campo39", "campo40", "campo41", "campo42", "campo43", 
        ];

        // Step 2: Map the processed data rows to a CSV-friendly format
        const rows = processedData.map(row => {
            return headers.map(field => {
                return row[field] !== undefined ? row[field] : '';
            }).join(";");
        });

        // Step 3: Combine the headers and the rows
        const csvContent = [headers.join(";"), ...rows].join("\n");

        const xxxx = "0921";
        const yyyy = "0921";

        // Derive the quarter (tt) and last two digits of the year (aa)
        const quarter = getQuarterFromDate(trimester.startDate);
        const shortYear = String(trimester.startDate.getFullYear()).slice(-2);

        // Format them as required: e.g. Q1 => "01", year 2024 => "24"
        const tt = quarter.toString().padStart(2, '0');  // "01", "02", "03", "04"
        const aa = shortYear;                            // "24" for 2024

        // Final file name
        const fileName = `V7M_${xxxx}_${yyyy}_${tt}${aa}.csv`;

        // Step 4: Create a downloadable CSV file
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', fileName);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();  // Trigger the download
            document.body.removeChild(link);
        }
    }
  
    // Helper function to determine trimester from a date
    function getTrimester(dateStr) {
        const date = new Date(dateStr);
        const year = date.getFullYear();
        const month = date.getMonth() + 1; // months are 0-indexed in JS
        let trimester;

        if (month >= 1 && month <= 3) {
            trimester = 1;
        } else if (month >= 4 && month <= 6) {
            trimester = 2;
        } else if (month >= 7 && month <= 9) {
            trimester = 3;
        } else {
            trimester = 4;
        }

        return `T${trimester}/${year.toString().slice(-2)}`;
    }

    function dateValue(dateObj) {
        return dateObj.getFullYear() * 10000 + (dateObj.getMonth() + 1) * 100 + dateObj.getDate();
    }


    let allCategoryMappings;

    function flattenMappings(mappings) {
        const flat = {};
        Object.keys(mappings).forEach(section => {
            const sub = mappings[section];
            // If sub is an object, add all its keys to the flat object.
            if (typeof sub === 'object' && sub !== null) {
            Object.keys(sub).forEach(key => {
                flat[key] = sub[key];
            });
            } else {
            flat[section] = mappings[section];
            }
        });
        return flat;
    }

    // Helper to sort campo keys (e.g., "campo001", "campo002", ...) numerically.
    function sortCampoKeys(flatObj) {
        const keys = Object.keys(flatObj);
        keys.sort((a, b) => {
            const numA = parseInt(a.replace("campo", ""), 10);
            const numB = parseInt(b.replace("campo", ""), 10);
            return numA - numB;
        });
        return keys;
    }
      

    function generateCSVFromMappings(allCategoryMappings) {
        const flat = flattenMappings(allCategoryMappings);
        const sortedKeys = sortCampoKeys(flat);
        const headerRow = sortedKeys.join(";");
        const valueRow = sortedKeys.map(key => flat[key]).join(";");
        return headerRow + "\n" + valueRow;
    }

    document.getElementById('process_riepilogo').addEventListener('click', function() {
        const selectedTrimester = getQuarterAndYearFromDate(new Date(trimester.startDate)); 
        allCategoryMappings = generateAllCategoryMappings(filteredData, selectedTrimester, categoryMappingFunctions, trimester);
        const htmlTable = buildFlussiTable(allCategoryMappings);

        // Insert into a container in your HTML
        document.getElementById("tableContainer").innerHTML = htmlTable;
        console.log("Final Mappings:", allCategoryMappings);
    });

    // Download CSV by creating a blob and clicking a temporary link.
    function downloadCSV(csvContent, fileName) {
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", fileName + ".csv");
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
    
    // Construct the file name according to your logic.
    function getCsvFileName(trimester) {
        const trim = getQuarterFromDate(trimester.startDate);
        const anno = String(trimester.startDate.getFullYear()).slice(-2);
        return "V7M_" + "0921_0921_0" + trim + anno;
    }
    
    // we add another button (or extend this listener) for CSV download.
    document.getElementById('download_csv').addEventListener('click', function() {
        // for example via generateAllCategoryMappings.
        const finalMappings = generateAllCategoryMappings(filteredData, 
        getQuarterAndYearFromDate(new Date(trimester.startDate)), 
        categoryMappingFunctions, 
        trimester
        );
    
        // Generate CSV content
        const csvContent = generateCSVFromMappings(allCategoryMappings);
    
        // Construct file name
        const fileName = getCsvFileName(trimester);
        downloadCSV(csvContent, fileName);
    });
    
    

    function countDataByTrimesterForCategory(data, selectedTrimester, category, trimester) {
        console.log("trimester", trimester.startDate. trimester)
        let counts = {
            pendenti_iniziali: 0,
            avviatoInTrimester: 0,
            giudiceSi: 0,
            esitoMancataAdesione: 0,
            esitoAccordo: 0,
            esitoMancatoAccordo: 0,
            pendenti_finali:0,
            conclusoInTrimester: 0,
            noRinuncia: 0,
            noRinunciaIncRiEquals1: 0,
            noRinunciaIncRiOther: 0,
        };

        let totalCases = 0;
        let closedBeforeTrimester = 0;
        let startedAfterTrimester = 0;


        allData.forEach(row => {
            if (row.MATERIA !== category) return;
            
            totalCases++;
            console.log (trimester.startDate, trimester.endDate)

            const avviatoTrimester = getTrimester(row.AVVIATO);
            const conclusoTrimester = getTrimester(row.CONCLUSO);

            const trimStart = trimester.startDate;
            const trimEnd = trimester.endDate;
            const avviatoDate = new Date(row.AVVIATO);
            const conclusoDate = new Date(row.CONCLUSO);

            // Compute numeric date values for comparison.
            const avviatoVal = dateValue(avviatoDate);
            const conclusoVal = dateValue(conclusoDate);
            const trimStartVal = dateValue(trimStart);
            const trimEndVal = dateValue(trimEnd);

            const noteText = (row.NOTE || "").toLowerCase();
            const esitoText = (row.ESITO || "").toLowerCase();

            if (row.AVVIATO && row.AVVIATO.trim() !== "") {          
                if (!isNaN(avviatoVal) && avviatoVal > trimStartVal) {
                    startedAfterTrimester++;
                }

                if (avviatoVal >= trimStartVal && avviatoVal <= trimEndVal) {
                    counts.avviatoInTrimester++;
                }
            }


            if (row.CONCLUSO && row.CONCLUSO.trim() !== "") {
            
                if (!isNaN(conclusoVal) && conclusoVal < trimStartVal) {
                    closedBeforeTrimester++;
                } 

                if (conclusoVal >= trimStartVal && conclusoVal <= trimEndVal) {
                    counts.conclusoInTrimester++;
                    // Normalize ESITO: trim spaces and convert to uppercase.
                    const esito = (row.ESITO || "").trim().toUpperCase();
                    if (esito === "ACCORDO") {
                        counts.esitoAccordo++;
                    } else if (esito === "MANCATO ACCORDO") {
                        counts.esitoMancatoAccordo++;
                    } else {
                        counts.esitoMancataAdesione++;
                    }
                    
                    // Normalize GIUDICE as well.
                    const giudice = (row.GIUDICE || "").trim().toUpperCase();
                    if (giudice === "SI") {
                        counts.giudiceSi++;
                    }
                

                    if (!noteText.includes("rinuncia") && !esitoText.includes("rinuncia")) {
                        counts.noRinuncia++;
                        let incRi = safeParseFloat(row["INC.RI"]);
                        if (incRi === 1) {
                            counts.noRinunciaIncRiEquals1++;
                        } else {
                            counts.noRinunciaIncRiOther++;
                        }
                    }
                }
            }
            
            counts.pendenti_iniziali = totalCases - closedBeforeTrimester - startedAfterTrimester;
            counts.pendenti_finali = counts.pendenti_iniziali + counts.avviatoInTrimester - counts.conclusoInTrimester;

        });   
        return counts;
    }

  
    function generateAllCategoryMappings(data, selectedTrimester, categoryMappingFunctions, trimester) {
        const finalCategoryMappings = {};
    
        // Add constant fields (global to the entire mapping)
        finalCategoryMappings["Constants"] = {
            campo001: "V.7.0",
            campo002: "Mediazioni",
            campo003: "800921",
            campo004: convertTimeFormat(trimester.startDate),
            campo005: convertTimeFormat(trimester.endDate)
        };
    
        // Loop through each category for which you have a mapping function.
        Object.keys(categoryMappingFunctions).forEach(category => {
            // Compute counts for the given category using the new direct logic.
            const counts = countDataByTrimesterForCategory(data, selectedTrimester, category, trimester);
            
            // Get the mapping function for this category.
            const mapFn = categoryMappingFunctions[category];
            
            // If both mapping function and counts exist, apply the mapping.
            if (mapFn && counts) {
                finalCategoryMappings[category] = mapFn(counts);
            } else {
                console.warn("Missing mapping function or counts for category:", category);
            }
        });
    
        // Process unique mediator mapping.
        const mediatorCount = countUniqueMediatoreByTrimester(data, trimester);
        const mediatorMapping = mapUniqueMediatoreField(mediatorCount);
        finalCategoryMappings["Unique Mediator"] = mediatorMapping;
        
        return finalCategoryMappings;
    }
    

    const categoryMappingFunctions = {
        "Affitto di Azienda": mapAffittoAziendaFields,
        "Altro": mapAltroFields,
        "Associazione in partecipazione": mapAssociazioneInPartecipazioneFields,
        "Comodato": mapComodatoFields,
        "Condominio": mapCondominioFields,
        "Consorzio": mapConsorzioFields,
        "Contratti assicurativi": mapContrattiAssicurativiFields,
        "Contratti bancari": mapContrattiBancariFields,
        "Contratti di somministrazione": mapContrattiDiSomministrazioneFields,
        "Contratti di subfornitura": mapContrattiDiSubfornituraFields,
        "Contratti finanziari": mapContrattiFinanziariFields,
        "Contratto di rete": mapContrattoDiReteFields,
        "Contratto d'Opera": mapContrattoDOperaFields,
        "Diffamazione": mapDiffamazioneFields,
        "Diritti reali": mapDirittiRealiFields,
        "Divisione": mapDivisioneFields,
        "Franchising": mapFranchisingFields,
        "Locazione": mapLocazioneFields,
        "Patti di famiglia": mapPattiDiFamigliaFields,
        "Responsabilità medica": mapResponsabilitaMedicaFields,
        "Società di persone": mapSocietaDiPersoneFields,
        "Successioni": mapSuccessioniFields,
    };

    function safeParseFloat(value) {
        const parsed = parseFloat(value);
        return isNaN(parsed) ? 0 : parsed;
    }
  
    function countUniqueMediatoreByTrimester(data, trimester) {
        // Create a Set to store unique mediators
        let mediatorsSet = new Set();

        // Parse the trimester start and end dates
        const trimStart = new Date(trimester.startDate);
        const trimEnd = new Date(trimester.endDate);

        data.forEach((row, index) => {
            // Check if the row has a non-empty CONCLUSO field
            if (row.CONCLUSO && row.CONCLUSO.trim() !== "") {
                const conclusoDate = new Date(row.CONCLUSO);
                // Check if the CONCLUSO date is strictly between the trimester start and end dates
                if (conclusoDate > trimStart && conclusoDate < trimEnd) {
                    // Only add the mediator if the field exists and is non-empty
                    if (row.MEDIATORE && row.MEDIATORE.trim() !== "") {
                    mediatorsSet.add(row.MEDIATORE.trim());
                    }
                }
            }
        });

        return mediatorsSet.size;
    }
      
    function mapUniqueMediatoreField(uniqueMediatorCount) {
        return { campo111: uniqueMediatorCount };
    }
  
    // 1. Condominio
    function mapCondominioFields(counts) {
    return {
        campo006: counts.pendenti_iniziali,
        campo007: counts.avviatoInTrimester,
        campo169: counts.giudiceSi, 
        campo008: counts.esitoMancataAdesione, 
        campo009: counts.esitoAccordo,  
        campo010: counts.esitoMancatoAccordo, 
        campo011: counts.conclusoInTrimester,     
        campo012: counts.pendenti_finali,
        campo170: counts.noRinuncia, 
        campo171: counts.noRinunciaIncRiEquals1,
        campo172: counts.noRinunciaIncRiOther,      
    };
    }
  
    // 2. Diritti reali
    function mapDirittiRealiFields(counts) {
    return {
        campo013: counts.pendenti_iniziali,     
        campo014: counts.avviatoInTrimester,           
        campo173: counts.giudiceSi,          
        campo015: counts.esitoMancataAdesione,       
        campo016: counts.esitoAccordo,              
        campo017: counts.esitoMancatoAccordo,       
        campo018: counts.conclusoInTrimester,       
        campo019: counts.pendenti_finali,         
        campo174: counts.noRinuncia,             
        campo175: counts.noRinunciaIncRiEquals1,    
        campo176: counts.noRinunciaIncRiOther,      
    };
    }

    // 3. Divisione
    function mapDivisioneFields(counts) {
    return {
        campo020: counts.pendenti_iniziali,
        campo021: counts.avviatoInTrimester,
        campo177: counts.giudiceSi, 
        campo022: counts.esitoMancataAdesione, 
        campo023: counts.esitoAccordo,  
        campo024: counts.esitoMancatoAccordo,
        campo025: counts.conclusoInTrimester,
        campo026: counts.pendenti_finali,
        campo178: counts.noRinuncia, 
        campo179: counts.noRinunciaIncRiEquals1,
        campo180: counts.noRinunciaIncRiOther,
    };
    }

    // 4. Successioni
    function mapSuccessioniFields(counts) {
    return {
        campo027: counts.pendenti_iniziali, 
        campo028: counts.avviatoInTrimester,
        campo181: counts.giudiceSi,
        campo029: counts.esitoMancataAdesione,
        campo030: counts.esitoAccordo, 
        campo031: counts.esitoMancatoAccordo,
        campo032: counts.conclusoInTrimester,
        campo033: counts.pendenti_finali,
        campo182: counts.noRinuncia, 
        campo183: counts.noRinunciaIncRiEquals1,
        campo184: counts.noRinunciaIncRiOther, 
    };
    }

    // 5. Patti di famiglia
    function mapPattiDiFamigliaFields(counts) {
    return {
        campo034: counts.pendenti_iniziali,
        campo035: counts.avviatoInTrimester,
        campo185: counts.giudiceSi,
        campo036: counts.esitoMancataAdesione,
        campo037: counts.esitoAccordo,
        campo038: counts.esitoMancatoAccordo,
        campo039: counts.conclusoInTrimester,
        campo040: counts.pendenti_finali,
        campo186: counts.noRinuncia,
        campo187: counts.noRinunciaIncRiEquals1,
        campo188: counts.noRinunciaIncRiOther,
    };
    }

    // 6. Locazione
    function mapLocazioneFields(counts) {
    return {
        campo041: counts.pendenti_iniziali,
        campo042: counts.avviatoInTrimester,
        campo189: counts.giudiceSi,
        campo043: counts.esitoMancataAdesione,
        campo044: counts.esitoAccordo,
        campo045: counts.esitoMancatoAccordo,
        campo046: counts.conclusoInTrimester,
        campo047: counts.pendenti_finali,
        campo190: counts.noRinuncia,
        campo191: counts.noRinunciaIncRiEquals1,
        campo192: counts.noRinunciaIncRiOther,        
    };
    }

    // 7. Comodato
    function mapComodatoFields(counts) {
    return {
        campo048: counts.pendenti_iniziali,
        campo049: counts.avviatoInTrimester,
        campo193: counts.giudiceSi,
        campo050: counts.esitoMancataAdesione,
        campo051: counts.esitoAccordo,
        campo052: counts.esitoMancatoAccordo,
        campo053: counts.conclusoInTrimester,
        campo054: counts.pendenti_finali,
        campo194: counts.noRinuncia,
        campo195: counts.noRinunciaIncRiEquals1,
        campo196: counts.noRinunciaIncRiOther,        
    };
    }

    // 8. Affitto di Azienda
    function mapAffittoAziendaFields(counts) {
    return {
        campo055: counts.pendenti_iniziali,
        campo056: counts.avviatoInTrimester,
        campo197: counts.giudiceSi,
        campo057: counts.esitoMancataAdesione,
        campo058: counts.esitoAccordo,
        campo059: counts.esitoMancatoAccordo,
        campo060: counts.conclusoInTrimester,
        campo061: counts.pendenti_finali,
        campo198: counts.noRinuncia,
        campo199: counts.noRinunciaIncRiEquals1,
        campo200: counts.noRinunciaIncRiOther,        
    };
    }

    // 9. Responsabilità medica
    function mapResponsabilitaMedicaFields(counts) {
    return {
        campo069: counts.pendenti_iniziali,
        campo070: counts.avviatoInTrimester,
        campo201: counts.giudiceSi,
        campo071: counts.esitoMancataAdesione,
        campo072: counts.esitoAccordo,
        campo073: counts.esitoMancatoAccordo,
        campo074: counts.conclusoInTrimester,
        campo075: counts.pendenti_finali,
        campo202: counts.noRinuncia,
        campo203: counts.noRinunciaIncRiEquals1,
        campo204: counts.noRinunciaIncRiOther,        
    };
    }

    // 10. Diffamazione
    function mapDiffamazioneFields(counts) {
    return {
        campo076: counts.pendenti_iniziali,
        campo077: counts.avviatoInTrimester,
        campo205: counts.giudiceSi,
        campo078: counts.esitoMancataAdesione,
        campo079: counts.esitoAccordo,
        campo080: counts.esitoMancatoAccordo,
        campo081: counts.conclusoInTrimester,
        campo082: counts.pendenti_finali,
        campo206: counts.noRinuncia,
        campo207: counts.noRinunciaIncRiEquals1,
        campo208: counts.noRinunciaIncRiOther,        
    };
    }

    // 11. Contratti assicurativi
    function mapContrattiAssicurativiFields(counts) {
    return {
        campo083: counts.pendenti_iniziali,
        campo084: counts.avviatoInTrimester,
        campo209: counts.giudiceSi,
        campo085: counts.esitoMancataAdesione,
        campo086: counts.esitoAccordo,
        campo087: counts.esitoMancatoAccordo,
        campo088: counts.conclusoInTrimester,
        campo089: counts.pendenti_finali,
        campo210: counts.noRinuncia,
        campo211: counts.noRinunciaIncRiEquals1,
        campo212: counts.noRinunciaIncRiOther,        
    };
    }

    // 12. Contratti bancari
    function mapContrattiBancariFields(counts) {
    return {
        campo090: counts.pendenti_iniziali,
        campo091: counts.avviatoInTrimester,
        campo213: counts.giudiceSi,
        campo092: counts.esitoMancataAdesione,
        campo093: counts.esitoAccordo,
        campo094: counts.esitoMancatoAccordo,
        campo095: counts.conclusoInTrimester,
        campo096: counts.pendenti_finali,
        campo214: counts.noRinuncia,
        campo215: counts.noRinunciaIncRiEquals1,
        campo216: counts.noRinunciaIncRiOther,        
    };
    }

    // 13. Contratti finanziari
    function mapContrattiFinanziariFields(counts) {
    return {
        campo097: counts.pendenti_iniziali,
        campo098: counts.avviatoInTrimester,
        campo217: counts.giudiceSi,
        campo099: counts.esitoMancataAdesione,
        campo100: counts.esitoAccordo,
        campo101: counts.esitoMancatoAccordo,
        campo102: counts.conclusoInTrimester,
        campo103: counts.pendenti_finali,
        campo218: counts.noRinuncia,
        campo219: counts.noRinunciaIncRiEquals1,
        campo220: counts.noRinunciaIncRiOther,        
    };
    }

    // 14. Associazione in partecipazione
    function mapAssociazioneInPartecipazioneFields(counts) {
    return {
        campo221: counts.pendenti_iniziali,
        campo222: counts.avviatoInTrimester,
        campo223: counts.giudiceSi,
        campo224: counts.esitoMancataAdesione,
        campo225: counts.esitoAccordo,
        campo226: counts.esitoMancatoAccordo,
        campo227: counts.conclusoInTrimester,
        campo228: counts.pendenti_finali,
        campo229: counts.noRinuncia,
        campo230: counts.noRinunciaIncRiEquals1,
        campo231: counts.noRinunciaIncRiOther,        
    };
    }

    // 15. Consorzio
    function mapConsorzioFields(counts) {
    return {
        campo232: counts.pendenti_iniziali,
        campo233: counts.avviatoInTrimester,
        campo234: counts.giudiceSi,
        campo235: counts.esitoMancataAdesione,
        campo236: counts.esitoAccordo,
        campo237: counts.esitoMancatoAccordo,
        campo238: counts.conclusoInTrimester,
        campo239: counts.pendenti_finali,
        campo240: counts.noRinuncia,
        campo241: counts.noRinunciaIncRiEquals1,
        campo242: counts.noRinunciaIncRiOther,        
    };
    }

    // 16. Franchising
    function mapFranchisingFields(counts) {
    return {
        campo243: counts.pendenti_iniziali,
        campo244: counts.avviatoInTrimester,
        campo245: counts.giudiceSi,
        campo246: counts.esitoMancataAdesione,
        campo247: counts.esitoAccordo,
        campo248: counts.esitoMancatoAccordo,
        campo249: counts.conclusoInTrimester,
        campo250: counts.pendenti_finali,
        campo251: counts.noRinuncia,
        campo252: counts.noRinunciaIncRiEquals1,
        campo253: counts.noRinunciaIncRiOther,        
    };
    }

    // 17. Contratto d'Opera
    function mapContrattoDOperaFields(counts) {
    return {
        campo254: counts.pendenti_iniziali,
        campo255: counts.avviatoInTrimester,
        campo256: counts.giudiceSi,
        campo257: counts.esitoMancataAdesione,
        campo258: counts.esitoAccordo,
        campo259: counts.esitoMancatoAccordo,
        campo260: counts.conclusoInTrimester,
        campo261: counts.pendenti_finali,
        campo262: counts.noRinuncia,
        campo263: counts.noRinunciaIncRiEquals1,
        campo264: counts.noRinunciaIncRiOther,   
    };
    }

    // 18. Contratto di rete
    function mapContrattoDiReteFields(counts) {
    return {
        campo265: counts.pendenti_iniziali,
        campo266: counts.avviatoInTrimester,
        campo267: counts.giudiceSi,
        campo268: counts.esitoMancataAdesione,
        campo269: counts.esitoAccordo,
        campo270: counts.esitoMancatoAccordo,
        campo271: counts.conclusoInTrimester,
        campo272: counts.pendenti_finali,
        campo273: counts.noRinuncia,
        campo274: counts.noRinunciaIncRiEquals1,
        campo275: counts.noRinunciaIncRiOther,        
    };
    }

    // 19. Contratti di somministrazione
    function mapContrattiDiSomministrazioneFields(counts) {
    return {
        campo276: counts.pendenti_iniziali,
        campo277: counts.avviatoInTrimester,
        campo278: counts.giudiceSi,
        campo279: counts.esitoMancataAdesione,
        campo280: counts.esitoAccordo,
        campo281: counts.esitoMancatoAccordo,
        campo282: counts.conclusoInTrimester,
        campo283: counts.pendenti_finali,
        campo284: counts.noRinuncia,
        campo285: counts.noRinunciaIncRiEquals1,
        campo286: counts.noRinunciaIncRiOther,        
    };
    }

    // 20. Società di persone
    function mapSocietaDiPersoneFields(counts) {
    return {
        campo306: counts.pendenti_iniziali,
        campo307: counts.avviatoInTrimester,
        campo308: counts.giudiceSi,
        campo309: counts.esitoMancataAdesione,
        campo310: counts.esitoAccordo,
        campo311: counts.esitoMancatoAccordo,
        campo312: counts.conclusoInTrimester,
        campo313: counts.pendenti_finali,
        campo314: counts.noRinuncia,
        campo315: counts.noRinunciaIncRiEquals1,
        campo316: counts.noRinunciaIncRiOther,        
    };
    }

    // 21. Contratti di subfornitura
    function mapContrattiDiSubfornituraFields(counts) {
    return {
        campo317: counts.pendenti_iniziali,
        campo318: counts.avviatoInTrimester,
        campo319: counts.giudiceSi,
        campo320: counts.esitoMancataAdesione,
        campo321: counts.esitoAccordo,
        campo322: counts.esitoMancatoAccordo,
        campo323: counts.conclusoInTrimester,
        campo324: counts.pendenti_finali,
        campo325: counts.noRinuncia,
        campo326: counts.noRinunciaIncRiEquals1,
        campo327: counts.noRinunciaIncRiOther,    
    };
    }

    // 22. Altro
    function mapAltroFields(counts) {
    return {
        campo104: counts.pendenti_iniziali,
        campo105: counts.avviatoInTrimester,
        campo302: counts.giudiceSi,
        campo106: counts.esitoMancataAdesione,
        campo107: counts.esitoAccordo,
        campo108: counts.esitoMancatoAccordo,
        campo109: counts.conclusoInTrimester,
        campo110: counts.pendenti_finali,
        campo303: counts.noRinuncia,
        campo304: counts.noRinunciaIncRiEquals1,
        campo305: counts.noRinunciaIncRiOther,        
    };
    }

    const columns = [
        "MOVIMENTO",
        "PENDENTI INIZIALI (a)",
        "ISCRITTI (b)",
        "di cui Demandate dal giudice (c)",
        "Mancata comparizione dell'aderente (d)",
        "Aderente comparso: Accordo raggiunto (e)",
        "Aderente comparso: Accordo non raggiunto (f)",
        "Totale definiti (g)",
        "PENDENTI FINALI (h)",
        "PRIMI INCONTRI ESEGUITI (i)",
        "di cui QUANTI CONTINUANO (l)",
        "di cui QUANTI NON CONTINUANO (m)"
    ];

    // Each entry has:
    //   name: the category (MOVIMENTO) label
    //   campos: an array of 11 campo keys in the exact order they appear in your spreadsheet
    const tableDefinition = [
        {
        name: "Condominio",
        campos: [
            "campo006", "campo007", "campo169",
            "campo008", "campo009", "campo010",
            "campo011", "campo012", "campo170",
            "campo171", "campo172"
        ]
        },
        {
        name: "Diritti reali",
        campos: [
            "campo013", "campo014", "campo173",
            "campo015", "campo016", "campo017",
            "campo018", "campo019", "campo174",
            "campo175", "campo176"
        ]
        },
        {
        name: "Divisione",
        campos: [
            "campo020", "campo021", "campo177",
            "campo022", "campo023", "campo024",
            "campo025", "campo026", "campo178",
            "campo179", "campo180"
        ]
        },
        {
        name: "Successioni",
        campos: [
            "campo027", "campo028", "campo181",
            "campo029", "campo030", "campo031",
            "campo032", "campo033", "campo182",
            "campo183", "campo184"
        ]
        },
        {
        name: "Patti di famiglia",
        campos: [
            "campo034", "campo035", "campo185",
            "campo036", "campo037", "campo038",
            "campo039", "campo040", "campo186",
            "campo187", "campo188"
        ]
        },
        {
        name: "Locazione",
        campos: [
            "campo041", "campo042", "campo189",
            "campo043", "campo044", "campo045",
            "campo046", "campo047", "campo190",
            "campo191", "campo192"
        ]
        },
        {
        name: "Comodato",
        campos: [
            "campo048", "campo049", "campo193",
            "campo050", "campo051", "campo052",
            "campo053", "campo054", "campo194",
            "campo195", "campo196"
        ]
        },
        {
        name: "Affitto di aziende",
        campos: [
            "campo055", "campo056", "campo197",
            "campo057", "campo058", "campo059",
            "campo060", "campo061", "campo198",
            "campo199", "campo200"
        ]
        },
        {
        name: "Responsabilità medica",
        campos: [
            "campo069", "campo070", "campo201",
            "campo071", "campo072", "campo073",
            "campo074", "campo075", "campo202",
            "campo203", "campo204"
        ]
        },
        {
        name: "Diffamazione",
        campos: [
            "campo076", "campo077", "campo205",
            "campo078", "campo079", "campo080",
            "campo081", "campo082", "campo206",
            "campo207", "campo208"
        ]
        },
        {
        name: "Contratti assicurativi",
        campos: [
            "campo083", "campo084", "campo209",
            "campo085", "campo086", "campo087",
            "campo088", "campo089", "campo210",
            "campo211", "campo212"
        ]
        },
        {
        name: "Contratti bancari",
        campos: [
            "campo090", "campo091", "campo213",
            "campo092", "campo093", "campo094",
            "campo095", "campo096", "campo214",
            "campo215", "campo216"
        ]
        },
        {
        name: "Contratti finanziari",
        campos: [
            "campo097", "campo098", "campo217",
            "campo099", "campo100", "campo101",
            "campo102", "campo103", "campo218",
            "campo219", "campo220"
        ]
        },
        {
        name: "Associazione in partecipazione",
        campos: [
            "campo221", "campo222", "campo223",
            "campo224", "campo225", "campo226",
            "campo227", "campo228", "campo229",
            "campo230", "campo231"
        ]
        },
        {
        name: "Consorzio",
        campos: [
            "campo232", "campo233", "campo234",
            "campo235", "campo236", "campo237",
            "campo238", "campo239", "campo240",
            "campo241", "campo242"
        ]
        },
        {
        name: "Franchising",
        campos: [
            "campo243", "campo244", "campo245",
            "campo246", "campo247", "campo248",
            "campo249", "campo250", "campo251",
            "campo252", "campo253"
        ]
        },
        {
        name: "Contratto d'Opera",
        campos: [
            "campo254", "campo255", "campo256",
            "campo257", "campo258", "campo259",
            "campo260", "campo261", "campo262",
            "campo263", "campo264"
        ]
        },
        {
        name: "Contratto di rete",
        campos: [
            "campo265", "campo266", "campo267",
            "campo268", "campo269", "campo270",
            "campo271", "campo272", "campo273",
            "campo274", "campo275"
        ]
        },
        {
        name: "Contratti di somministrazione",
        campos: [
            "campo276", "campo277", "campo278",
            "campo279", "campo280", "campo281",
            "campo282", "campo283", "campo284",
            "campo285", "campo286"
        ]
        },
        {
        name: "Società di persone",
        campos: [
            "campo306", "campo307", "campo308",
            "campo309", "campo310", "campo311",
            "campo312", "campo313", "campo314",
            "campo315", "campo316"
        ]
        },
        {
        name: "Contratti di subfornitura",
        campos: [
            "campo317", "campo318", "campo319",
            "campo320", "campo321", "campo322",
            "campo323", "campo324", "campo325",
            "campo326", "campo327"
        ]
        },
        {
        name: "Altro",
        campos: [
            "campo104", "campo105", "campo302",
            "campo106", "campo107", "campo108",
            "campo109", "campo110", "campo303",
            "campo304", "campo305"
        ]
        }
    ];
  

    function buildFlussiTable(allCategoryMappings) {
        // Start building the HTML for the table
        let html = `
          <table border="1" style="border-collapse: collapse;">
            <thead>
              <tr>
        `;
      
        // Add column headers
        columns.forEach(header => {
          html += `<th>${header}</th>`;
        });
      
        html += `
              </tr>
            </thead>
            <tbody>
        `;
      
        // For each category in our table definition, build a row
        tableDefinition.forEach(def => {
          const categoryName = def.name;
          const campoKeys = def.campos; // array of 11 campo keys
          const mapping = allCategoryMappings[categoryName] || {}; // e.g. { campo006: 10, ... }
      
          // Start row with category name in the first column
          html += `<tr><td>${categoryName}</td>`;
      
          // Then each of the 11 columns
          campoKeys.forEach(campo => {
            // If the mapping doesn't have the campo, use 0 or some default
            const value = (mapping[campo] !== undefined) ? mapping[campo] : 0;
            html += `<td>${value}</td>`;
          });
      
          html += `</tr>`;
        });

          // Append the Unique Mediator row if present.
        if (allCategoryMappings["Unique Mediator"]) {
            const uniqueValue = allCategoryMappings["Unique Mediator"].campo111;
            // Assume table has 12 columns total. We'll span 11 columns for the label.
            html += `<tr>`;
            html += `<td colspan="11" style="text-align:right; font-weight:bold;">Numero di mediatori impegnato nel mese in almeno un procedimento</td>`;
            html += `<td>${uniqueValue}</td>`;
            html += `</tr>`;
        }
      
        html += `
            </tbody>
          </table>
        `;
      
        return html;
    }
      

});