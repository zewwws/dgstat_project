
const startingValues = {
    2024: {
      condominio: { campo010_condominio_pendenti_finali: 1000 },
      diritti_reali: { campo010_condominio_pendenti_finali: 1500 },
      divisione: { campo010_condominio_pendenti_finali: 1200 },
      successioni_ereditarie: { campo010_condominio_pendenti_finali: 1300 },
      patti_di_famiglia: { campo010_condominio_pendenti_finali: 1100 },
      locazione: { campo010_condominio_pendenti_finali: 1400 },
      comodato: { campo010_condominio_pendenti_finali: 1600 },
      affitto_di_aziende: { campo010_condominio_pendenti_finali: 1700 },
      risarcimento_danni_da_responsabilita_medica: { campo010_condominio_pendenti_finali: 1800 },
      risarcimento_danni_da_diffamazione_a_mezzo_stampa: { campo010_condominio_pendenti_finali: 1900 },
      contratti_assicurativi: { campo010_condominio_pendenti_finali: 2000 },
      contratti_bancari: { campo010_condominio_pendenti_finali: 2100 },
      contratti_finanziari: { campo010_condominio_pendenti_finali: 2200 },
      associazione_in_partecipazione: { campo010_condominio_pendenti_finali: 2300 },
      consorzio: { campo010_condominio_pendenti_finali: 2400 },
      franchising: { campo010_condominio_pendenti_finali: 2500 },
      contratto_d_opera: { campo010_condominio_pendenti_finali: 2600 },
      contratti_di_rete: { campo010_condominio_pendenti_finali: 2700 },
      contratti_di_somministrazione: { campo010_condominio_pendenti_finali: 2800 },
      societa_di_persone: { campo010_condominio_pendenti_finali: 2900 },
      contratti_di_subfornitura: { campo010_condominio_pendenti_finali: 3000 },
      altra_natura_delle_controv: { campo010_condominio_pendenti_finali: 3100 }
    }
  };  
  
      // const basePendenti = {
    //     "Affitto di Azienda": 0,
    //     "Altro": 11,
    //     "Associazione in partecipazione": 0,
    //     "Comodato": 1,
    //     "Condominio": 17,
    //     "Consorzio": 0,
    //     "Contratti assicurativi": 1,
    //     "Contratti bancari": 0,
    //     "Contratti di somministrazione": 0,
    //     "Contratti di subfornitura": 0,
    //     "Contratti finanziari": 1,
    //     "Contratto di rete": 0,
    //     "Contratto d'Opera": 0,
    //     "Diffamazione": 0,
    //     "Diritti reali": 18,
    //     "Divisione": 10,
    //     "Franchising": 0,
    //     "Locazione": 4,
    //     "Patti di famiglia": 0,
    //     "Responsabilità medica": 1,
    //     "Società di persone": 0,
    //     "Successioni": 3
    // };

        // const altroAnnotations = {
    //     campo104: "pendenti_iniziali",
    //     campo105: "pendenti_finali",
    //     campo302: "avviatoInTrimester",
    //     campo107: "esitoMancataAdesione",
    //     campo109: "esitoAccordo",
    //     campo108: "esitoMancatoAccordo",
    //     campo106: "conclusoInTrimester",
    //     campo110: "giudiceSi",
    //     campo303: "noRinuncia",
    //     campo304: "noRinunciaIncRiEquals1",
    //     campo305: "noRinunciaIncRiOther"
    // };

    // function printMappingWithAnnotations(mapping, annotations) {
    //     for (const key in mapping) {
    //       if (mapping.hasOwnProperty(key)) {
    //         const friendly = annotations[key] || key;
    //         console.log(`${key}: ${mapping[key]} (${friendly})`);
    //       }
    //     }
    // }

  
  // Function to get the starting value for campo010_condominio_pendenti_finali based on year and quarter
  function getStartingValue(year, quarter) {
    if (year === 2024 && quarter === 1) {
      return startingValues[2024].campo010_condominio_pendenti_finali;
    }
  
    // For subsequent years, get the final value of the previous quarter
    return null;  // Replace this logic with how the value is tracked from previous years
  }
  
  // Function to calculate campo006_condominio_pendenti_iniziali
  function calculateCampo006(currentYear, currentQuarter, previousQuarterValue) {
    // For the first quarter of each year, we use the starting value
    if (currentQuarter === 1) {
      return getStartingValue(currentYear, currentQuarter);
    }
  
    // Otherwise, return the value from the previous quarter
    return previousQuarterValue;
  }
  
  // Example for the current quarter data (2nd quarter, 2024)
  const currentQuarterData = {
    year: 2024,
    quarter: 2,
    previousQuarterValue: 1500,  // Value from the previous quarter (1st quarter 2024)
  };
  
  // Calculate the value for campo006_condominio_pendenti_iniziali
  const campo006Value = calculateCampo006(
    currentQuarterData.year,
    currentQuarterData.quarter,
    currentQuarterData.previousQuarterValue
  );
  
  console.log('campo006_condominio_pendenti_iniziali:', campo006Value);

function countIscrittiByCategory(data, avvioColumn, materiaColumn, categoryMap) {
    let result = {};

    Object.entries(categoryMap).forEach(([campoKey, materiaValue]) => {
        result[campoKey] = data.filter(row => row[avvioColumn] && row[materiaColumn] === materiaValue).length;
    });

    return result;
}

// Mapping `campo_xxx` to corresponding `MATERIA`
const categoryMap = {
    "campo007_condominio_iscritti": "Condominio",
    "campo014_diritti_reali_iscritti": "Diritti reali",
    "campo021_divisione_iscritti": "Divisione",
    "campo028_successioni_ereditarie_iscritti": "Successioni",
    "campo035_patti_di_famiglia_iscritti": "Patti di famiglia",
    "campo042_locazione_iscritti": "Locazione",
    "campo049_comodato_iscritti": "Comodato",
    "campo056_affitto_di_aziende_iscritti": "Affitto di Azienda",
    "campo070_risarcimento_danni_responsabilita_medica_iscritti": "Responsabilità medica",
    "campo084_contratti_assicurativi_iscritti": "Contratti assicurativi",
    "campo091_contratti_bancari_iscritti": "Contratti bancari",
    "campo098_contratti_finanziari_iscritti": "Contratti finanziari",
    "campo222_associazione_in_partecipazione_iscritti": "Associazione in partecipazione",
    "campo233_consorzio_iscritti": "Consorzio",
    "campo244_franchising_iscritti": "Franchising",
    "campo255_contratto_d_opera_iscritti": "Contratto d'Opera",
    "campo266_trasporto_iscritti": "Contratti di somministrazione",
    "campo277_immobili_iscritti": "Società di persone",
    "campo288_altro_iscritti": "Altro"
};

// Example Data
const data = [
    { AVVIO: "2024-01-10", MATERIA: "Condominio" },
    { AVVIO: "", MATERIA: "Condominio" }, 
    { AVVIO: "2024-02-15", MATERIA: "Diritti reali" },
    { AVVIO: "2024-03-20", MATERIA: "Condominio" },
    { AVVIO: "2024-02-10", MATERIA: "Locazione" },
    { AVVIO: "2024-01-05", MATERIA: "Contratti bancari" }
];

// Execute function
const iscrittiCounts = countIscrittiByCategory(data, "AVVIO", "MATERIA", categoryMap);

console.log(iscrittiCounts);

const basePendenti = {
  "Affitto di Azienda": 0,
  "Altro": 11,
  "Associazione in partecipazione": 0,
  "Comodato": 1,
  "Condominio": 17,
  "Consorzio": 0,
  "Contratti assicurativi": 1,
  "Contratti bancari": 0,
  "Contratti di somministrazione": 0,
  "Contratti di subfornitura": 0,
  "Contratti finanziari": 1,
  "Contratto di rete": 0,
  "Contratto d'Opera": 0,
  "Diffamazione": 0,
  "Diritti reali": 18,
  "Divisione": 10,
  "Franchising": 0,
  "Locazione": 4,
  "Patti di famiglia": 0,
  "Responsabilità medica": 1,
  "Società di persone": 0,
  "Successioni": 3
};

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

function calculateCumulativeDataForCategory(data, sortedTrimesters, basePendentiValue, category) {
  let cumulativeResults = {};
  let previousFinal = basePendentiValue; // For the first trimester, use the base value

  sortedTrimesters.forEach((trimester, index) => {
    let counts = countDataByTrimesterForCategory(data, trimester, category);
    
    // Set pendenti_iniziali for current trimester
    counts.pendenti_iniziali = (index === 0) ? basePendentiValue : previousFinal;
    
    // Compute pendenti_finali using the formula:
    counts.pendenti_finali = counts.pendenti_iniziali + counts.avviatoInTrimester - counts.conclusoInTrimester;
    
    cumulativeResults[trimester] = counts;
    previousFinal = counts.pendenti_finali;
  });
  
  return cumulativeResults;
}
 

function countDataByTrimesterForCategory(data, selectedTrimester, category) {
  let counts = {
    avviatoInTrimester: 0,
    conclusoInTrimester: 0,
    esitoMancataAdesione: 0,
    esitoMancatoAccordo: 0,
    esitoAccordo: 0,
    giudiceSi: 0 ,
  };

  data.forEach(row => {
    if (row.MATERIA !== category) return;

    const avviatoTrimester = getTrimester(row.AVVIATO);
    const conclusoTrimester = getTrimester(row.CONSLUSO);

    
        // Count AVVIATO if in selected trimester
        if (avviatoTrimester === selectedTrimester) {
          counts.avviatoInTrimester++;
      }


    // Count AVVIATO if in selected trimester
    if (avviatoTrimester === selectedTrimester) {
      counts.avviatoInTrimester++;
    }
    
    
    // If CONSLUSO is in the selected trimester, count it and its sub-conditions
    if (conclusoTrimester === selectedTrimester) {
      counts.conclusoInTrimester++;
      if (row.ESITO === "MANCATA ADESIONE") counts.esitoMancataAdesione++;
      if (row.ESITO === "MANCATO ACCORDO") counts.esitoMancatoAccordo++;
      if (row.ESITO === "ACCORDO") counts.esitoAccordo++;
      if (row.GIUDICE === "Si")  counts.giudiceSi++;
    }

    const noteText = (row.NOTE || "").toLowerCase();

    if ((avviatoTrimester === selectedTrimester || conclusoTrimester === selectedTrimester) && !noteText.includes("rinuncia")) {
      counts.noRinuncia++;
      
      // Additional sub-condition based on INC.RI
      if (row["INC.RI"] === 1) {
        counts.noRinunciaIncRiEquals1++;
      } else {
        counts.noRinunciaIncRiOther++;
      }
    }
  });
  
  return counts;
}

function countUniqueMediatoreByTrimester(data, sortedTrimesters) {
  let mediatorResults = {};

  sortedTrimesters.forEach(trimester => {
    const mediatorsSet = new Set();

    data.forEach(row => {
      // Check if either AVVIATO or CONSLUSO falls in the current trimester
      const avviatoTrimester = getTrimester(row.AVVIATO);
      const conclusoTrimester = getTrimester(row.CONSLUSO);

      if (avviatoTrimester === trimester || conclusoTrimester === trimester) {
        if (row.MEDIATORE) { // only add if the field exists and is not empty
          mediatorsSet.add(row.MEDIATORE);
        }
      }
    });

    mediatorResults[trimester] = mediatorsSet.size;
  });

  return mediatorResults;
}

function mapCondominioFields(counts) {
  return {
    campo006: counts.pendenti_iniziali,
    campo007: counts.pendenti_finali,
    campo169: counts.avviatoInTrimester,
    campo008: counts.conclusoInTrimester,
    campo009: counts.esitoMancataAdesione,
    campo010: counts.esitoMancatoAccordo,
    campo011: counts.esitoAccordo,
    campo012: counts.giudiceSi,
    campo170: counts.noRinuncia,
    campo171: counts.noRinunciaIncRiEquals1,
    campo172: counts.noRinunciaIncRiOther,
  };
}

function mapDirittiRealiFields(counts) {
  return {
    campo013: counts.pendenti_iniziali,       // 1. pendenti_iniziali
    campo014: counts.pendenti_finali,           // 2. pendenti_finali
    campo173: counts.avviatoInTrimester,        // 3. avviatoInTrimester
    campo015: counts.conclusoInTrimester,       // 4. conclusoInTrimester
    campo016: counts.esitoMancataAdesione,        // 5. esitoMancataAdesione
    campo017: counts.esitoMancatoAccordo,         // 6. esitoMancatoAccordo
    campo018: counts.esitoAccordo,                // 7. esitoAccordo
    campo019: counts.giudiceSi,                   // 8. giudiceSi
    campo174: counts.noRinuncia,                  // 9. noRinuncia
    campo175: counts.noRinunciaIncRiEquals1,      // 10. noRinunciaIncRiEquals1
    campo176: counts.noRinunciaIncRiOther         // 11. noRinunciaIncRiOther
  };
}

function mapDivisioneFields(counts) {
  return {
    campo020: counts.pendenti_iniziali,
    campo021: counts.pendenti_finali,
    campo177: counts.avviatoInTrimester,
    campo022: counts.conclusoInTrimester,
    campo023: counts.esitoMancataAdesione,
    campo024: counts.esitoMancatoAccordo,
    campo025: counts.esitoAccordo,
    campo026: counts.giudiceSi,
    campo178: counts.noRinuncia,
    campo179: counts.noRinunciaIncRiEquals1,
    campo180: counts.noRinunciaIncRiOther
  };
}

function mapSuccessioniFields(counts) {
  return {
    campo027: counts.pendenti_iniziali,
    campo028: counts.pendenti_finali,
    campo181: counts.avviatoInTrimester,
    campo029: counts.conclusoInTrimester,
    campo030: counts.esitoMancataAdesione,
    campo031: counts.esitoMancatoAccordo,
    campo032: counts.esitoAccordo,
    campo033: counts.giudiceSi,
    campo182: counts.noRinuncia,
    campo183: counts.noRinunciaIncRiEquals1,
    campo184: counts.noRinunciaIncRiOther
  };
}

function mapPattiDiFamigliaFields(counts) {
  return {
    campo034: counts.pendenti_iniziali,
    campo035: counts.pendenti_finali,
    campo185: counts.avviatoInTrimester,
    campo036: counts.conclusoInTrimester,
    campo037: counts.esitoMancataAdesione,
    campo038: counts.esitoMancatoAccordo,
    campo039: counts.esitoAccordo,
    campo040: counts.giudiceSi,
    campo186: counts.noRinuncia,
    campo187: counts.noRinunciaIncRiEquals1,
    campo188: counts.noRinunciaIncRiOther
  };
}

function mapLocazioneFields(counts) {
  return {
    campo041: counts.pendenti_iniziali,
    campo042: counts.pendenti_finali,
    campo189: counts.avviatoInTrimester,
    campo043: counts.conclusoInTrimester,
    campo044: counts.esitoMancataAdesione,
    campo045: counts.esitoMancatoAccordo,
    campo046: counts.esitoAccordo,
    campo047: counts.giudiceSi,
    campo190: counts.noRinuncia,
    campo191: counts.noRinunciaIncRiEquals1,
    campo192: counts.noRinunciaIncRiOther,
  };
}

function mapComodatoFields(counts) {
  return {
    campo048: counts.pendenti_iniziali,
    campo049: counts.pendenti_finali,
    campo193: counts.avviatoInTrimester,
    campo050: counts.conclusoInTrimester,
    campo051: counts.esitoMancataAdesione,
    campo052: counts.esitoMancatoAccordo,
    campo053: counts.esitoAccordo,
    campo054: counts.giudiceSi,
    campo194: counts.noRinuncia,
    campo195: counts.noRinunciaIncRiEquals1,
    campo196: counts.noRinunciaIncRiOther
  };
}

function mapAffittoAziendaFields(counts) {
  return {
    campo055: counts.pendenti_iniziali,
    campo056: counts.pendenti_finali,
    campo197: counts.avviatoInTrimester,
    campo057: counts.conclusoInTrimester,
    campo058: counts.esitoMancataAdesione,
    campo059: counts.esitoMancatoAccordo,
    campo060: counts.esitoAccordo,
    campo061: counts.giudiceSi,
    campo198: counts.noRinuncia,
    campo199: counts.noRinunciaIncRiEquals1,
    campo200: counts.noRinunciaIncRiOther,
  };
}

function mapResponsabilitaMedicaFields(counts) {
  return {
    campo069: counts.pendenti_iniziali,
    campo070: counts.pendenti_finali,
    campo201: counts.avviatoInTrimester,
    campo071: counts.conclusoInTrimester,
    campo072: counts.esitoMancataAdesione,
    campo073: counts.esitoMancatoAccordo,
    campo074: counts.esitoAccordo,
    campo075: counts.giudiceSi,
    campo202: counts.noRinuncia,
    campo203: counts.noRinunciaIncRiEquals1,
    campo204: counts.noRinunciaIncRiOther
  };
}

function mapDiffamazioneFields(counts) {
  return {
    campo076: counts.pendenti_iniziali,
    campo077: counts.pendenti_finali,
    campo205: counts.avviatoInTrimester,
    campo078: counts.conclusoInTrimester,
    campo079: counts.esitoMancataAdesione,
    campo080: counts.esitoMancatoAccordo,
    campo081: counts.esitoAccordo,
    campo082: counts.giudiceSi,
    campo206: counts.noRinuncia,
    campo207: counts.noRinunciaIncRiEquals1,
    campo208: counts.noRinunciaIncRiOther
  };
}

function mapContrattiAssicurativiFields(counts) {
  return {
    campo083: counts.pendenti_iniziali,
    campo084: counts.pendenti_finali,
    campo209: counts.avviatoInTrimester,
    campo085: counts.conclusoInTrimester,
    campo086: counts.esitoMancataAdesione,
    campo087: counts.esitoMancatoAccordo,
    campo088: counts.esitoAccordo,
    campo089: counts.giudiceSi,
    campo210: counts.noRinuncia,
    campo211: counts.noRinunciaIncRiEquals1,
    campo212: counts.noRinunciaIncRiOther
  };
}

function mapContrattiBancariFields(counts) {
  return {
    campo090: counts.pendenti_iniziali,
    campo091: counts.pendenti_finali,
    campo213: counts.avviatoInTrimester,
    campo092: counts.conclusoInTrimester,
    campo093: counts.esitoMancataAdesione,
    campo094: counts.esitoMancatoAccordo,
    campo095: counts.esitoAccordo,
    campo096: counts.giudiceSi,
    campo214: counts.noRinuncia,
    campo215: counts.noRinunciaIncRiEquals1,
    campo216: counts.noRinunciaIncRiOther
  };
}

function mapContrattiFinanziariFields(counts) {
  return {
    campo097: counts.pendenti_iniziali,
    campo098: counts.pendenti_finali,
    campo217: counts.avviatoInTrimester,
    campo099: counts.conclusoInTrimester,
    campo100: counts.esitoMancataAdesione,
    campo101: counts.esitoMancatoAccordo,
    campo102: counts.esitoAccordo,
    campo103: counts.giudiceSi,
    campo218: counts.noRinuncia,
    campo219: counts.noRinunciaIncRiEquals1,
    campo220: counts.noRinunciaIncRiOther,
  };
}

function mapAssociazioneInPartecipazioneFields(counts) {
  return {
    campo221: counts.pendenti_iniziali,
    campo222: counts.pendenti_finali,
    campo223: counts.avviatoInTrimester,
    campo224: counts.conclusoInTrimester,
    campo225: counts.esitoMancataAdesione,
    campo226: counts.esitoMancatoAccordo,
    campo227: counts.esitoAccordo,
    campo228: counts.giudiceSi,
    campo229: counts.noRinuncia,
    campo230: counts.noRinunciaIncRiEquals1,
    campo231: counts.noRinunciaIncRiOther
  };
}

function mapConsorzioFields(counts) {
  return {
    campo232: counts.pendenti_iniziali,
    campo233: counts.pendenti_finali,
    campo234: counts.avviatoInTrimester,
    campo235: counts.conclusoInTrimester,
    campo236: counts.esitoMancataAdesione,
    campo237: counts.esitoMancatoAccordo,
    campo238: counts.esitoAccordo,
    campo239: counts.giudiceSi,
    campo240: counts.noRinuncia,
    campo241: counts.noRinunciaIncRiEquals1,
    campo242: counts.noRinunciaIncRiOther,
  };
}

function mapFranchisingFields(counts) {
  return {
    campo243: counts.pendenti_iniziali,
    campo244: counts.pendenti_finali,
    campo245: counts.avviatoInTrimester,
    campo246: counts.conclusoInTrimester,
    campo247: counts.esitoMancataAdesione,
    campo248: counts.esitoMancatoAccordo,
    campo249: counts.esitoAccordo,
    campo250: counts.giudiceSi,
    campo251: counts.noRinuncia,
    campo252: counts.noRinunciaIncRiEquals1,
    campo253: counts.noRinunciaIncRiOther
  };
}

function mapContrattoDOperaFields(counts) {
  return {
    campo254: counts.pendenti_iniziali,
    campo255: counts.pendenti_finali,
    campo256: counts.avviatoInTrimester,
    campo257: counts.conclusoInTrimester,
    campo258: counts.esitoMancataAdesione,
    campo259: counts.esitoMancatoAccordo,
    campo260: counts.esitoAccordo,
    campo261: counts.giudiceSi,
    campo262: counts.noRinuncia,
    campo263: counts.noRinunciaIncRiEquals1,
    campo264: counts.noRinunciaIncRiOther,
  };
}

function mapContrattoDiReteFields(counts) {
  return {
    campo265: counts.pendenti_iniziali,
    campo266: counts.pendenti_finali,
    campo267: counts.avviatoInTrimester,
    campo268: counts.conclusoInTrimester,
    campo269: counts.esitoMancataAdesione,
    campo270: counts.esitoMancatoAccordo,
    campo271: counts.esitoAccordo,
    campo272: counts.giudiceSi,
    campo273: counts.noRinuncia,
    campo274: counts.noRinunciaIncRiEquals1,
    campo275: counts.noRinunciaIncRiOther,
  };
}

function mapContrattiDiSomministrazioneFields(counts) {
  return {
    campo276: counts.pendenti_iniziali,
    campo277: counts.pendenti_finali,
    campo278: counts.avviatoInTrimester,
    campo279: counts.conclusoInTrimester,
    campo280: counts.esitoMancataAdesione,
    campo281: counts.esitoMancatoAccordo,
    campo282: counts.esitoAccordo,
    campo283: counts.giudiceSi,
    campo284: counts.noRinuncia,
    campo285: counts.noRinunciaIncRiEquals1,
    campo286: counts.noRinunciaIncRiOther,
  };
}

function mapContrattiDiSomministrazioneFields(counts) {
  return {
    campo276: counts.pendenti_iniziali,
    campo277: counts.pendenti_finali,
    campo278: counts.avviatoInTrimester,
    campo279: counts.conclusoInTrimester,
    campo280: counts.esitoMancataAdesione,
    campo281: counts.esitoMancatoAccordo,
    campo282: counts.esitoAccordo,
    campo283: counts.giudiceSi,
    campo284: counts.noRinuncia,
    campo285: counts.noRinunciaIncRiEquals1,
    campo286: counts.noRinunciaIncRiOther,
  };
}

function mapSocietaDiPersoneFields(counts) {
  return {
    campo306: counts.pendenti_iniziali,
    campo307: counts.pendenti_finali,
    campo308: counts.avviatoInTrimester,
    campo309: counts.conclusoInTrimester,
    campo310: counts.esitoMancataAdesione,
    campo311: counts.esitoMancatoAccordo,
    campo312: counts.esitoAccordo,
    campo313: counts.giudiceSi,
    campo314: counts.noRinuncia,
    campo315: counts.noRinunciaIncRiEquals1,
    campo316: counts.noRinunciaIncRiOther,
  };
}

function mapContrattiDiSubfornituraFields(counts) {
  return {
    campo317: counts.pendenti_iniziali,
    campo318: counts.pendenti_finali,
    campo319: counts.avviatoInTrimester,
    campo320: counts.conclusoInTrimester,
    campo321: counts.esitoMancataAdesione,
    campo322: counts.esitoMancatoAccordo,
    campo323: counts.esitoAccordo,
    campo324: counts.giudiceSi,
    campo325: counts.noRinuncia,
    campo326: counts.noRinunciaIncRiEquals1,
    campo327: counts.noRinunciaIncRiOther,
  };
}

function mapAltroFields(counts) {
  return {
    campo104: counts.pendenti_iniziali,
    campo105: counts.pendenti_finali,
    campo302: counts.avviatoInTrimester,
    campo106: counts.conclusoInTrimester,
    campo107: counts.esitoMancataAdesione,
    campo108: counts.esitoMancatoAccordo,
    campo109: counts.esitoAccordo,
    campo110: counts.giudiceSi,
    campo303: counts.noRinuncia,
    campo304: counts.noRinunciaIncRiEquals1,
    campo305: counts.noRinunciaIncRiOther,
  };
}

function mapUniqueMediatoreField(mediatorResults, selectedTrimester) {
  return { campo111: mediatorResults[selectedTrimester] || 0 };
}





function calculateCumulativeDataForCategory(data, sortedTrimesters, basePendentiValue, category) {
  let cumulativeResults = {};
  let previousFinal = basePendentiValue; // For the first trimester, use the base value

  sortedTrimesters.forEach((trimester, index) => {
      // Get counts for this trimester
      let counts = countDataByTrimesterForCategory(data, trimester, category);
      
      // Set pendenti_iniziali for current trimester
      counts.pendenti_iniziali = (index === 0) ? basePendentiValue : previousFinal;
      
      // Compute pendenti_finali using the formula:
      // pendenti_finali = pendenti_iniziali + avviatoInTrimester - conclusoInTrimester
      counts.pendenti_finali = counts.pendenti_iniziali + counts.avviatoInTrimester - counts.conclusoInTrimester;
      
      
      cumulativeResults[trimester] = counts;
      previousFinal = counts.pendenti_finali;
  });

  return cumulativeResults;
}








