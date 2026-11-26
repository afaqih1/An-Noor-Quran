import { 
  Document, 
  Packer, 
  Paragraph, 
  TextRun, 
  HeadingLevel, 
  AlignmentType, 
  Table, 
  TableRow, 
  TableCell, 
  WidthType, 
  BorderStyle, 
  ShadingType,
  ImageRun 
} from 'docx';
import { 
  SALAT_RECITATIONS, 
  SALAT_POSITION_CATEGORIES, 
  SalatRecitation,
  PositionCategory,
  SALAT_3D_POSTURE_IMAGES,
  getSalat3DImage
} from './salatRecitationsData';

export interface SalatExportOptions {
  includeTransliteration?: boolean;
  includeEnglish?: boolean;
  includeAmharic?: boolean;
  includeNotes?: boolean;
  includeImages?: boolean;
  filterRuling?: 'all' | 'essential';
}

/**
 * Helper to fetch image as Uint8Array for docx embedding
 */
async function fetchImageUint8Array(imageUrl: string): Promise<Uint8Array | null> {
  try {
    const res = await fetch(imageUrl);
    if (!res.ok) return null;
    const arrayBuffer = await res.arrayBuffer();
    return new Uint8Array(arrayBuffer);
  } catch (err) {
    console.warn('Could not fetch image for docx export:', err);
    return null;
  }
}

/**
 * Helper to fetch image as base64 data URI for print/PDF export
 */
async function fetchImageBase64(imageUrl: string): Promise<string> {
  try {
    const res = await fetch(imageUrl);
    if (!res.ok) return imageUrl;
    const blob = await res.blob();
    return new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = () => resolve(imageUrl);
      reader.readAsDataURL(blob);
    });
  } catch {
    return imageUrl;
  }
}

/**
 * Generates an authentic, professionally styled Microsoft Word document (.docx)
 * containing the complete guide of what to recite during Salat in every position
 * in Arabic with transliterations, translations, and 3D position images.
 */
export async function generateSalatRecitationsDocx(options: SalatExportOptions = {}): Promise<Blob> {
  const {
    includeTransliteration = true,
    includeEnglish = true,
    includeAmharic = true,
    includeNotes = true,
    includeImages = true,
    filterRuling = 'all'
  } = options;

  // Pre-load 3D posture images into memory for docx inclusion
  const imageBytesMap = new Map<string, Uint8Array>();
  if (includeImages) {
    const uniqueUrls = Array.from(new Set(Object.values(SALAT_3D_POSTURE_IMAGES)));
    await Promise.all(
      uniqueUrls.map(async (url) => {
        const bytes = await fetchImageUint8Array(url);
        if (bytes) {
          imageBytesMap.set(url, bytes);
        }
      })
    );
  }

  const docChildren: (Paragraph | Table)[] = [];

  // 1. Document Title
  docChildren.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      heading: HeadingLevel.HEADING_1,
      spacing: { before: 200, after: 120 },
      children: [
        new TextRun({
          text: 'WHAT TO RECITE DURING SALAT IN EVERY POSITION',
          font: 'Calibri',
          size: 32, // 16pt
          bold: true,
          color: '064E3B', // Deep Emerald
        }),
      ],
    })
  );

  // Arabic Title
  docChildren.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      bidirectional: true,
      spacing: { before: 60, after: 140 },
      children: [
        new TextRun({
          text: 'أذكار وأدعية الصلاة في كل ركن وموضع من هدي النبي ﷺ',
          font: 'Traditional Arabic',
          size: 36, // 18pt
          bold: true,
          rightToLeft: true,
          color: '064E3B',
        }),
      ],
    })
  );

  // Subtitle / Dedication Metadata
  docChildren.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 60, after: 200 },
      children: [
        new TextRun({
          text: 'An-Noor Quran Companion • Comprehensive Guide with Tashkeel, Transliteration & Translations',
          font: 'Calibri',
          size: 20,
          italics: true,
          color: '475569',
        }),
        new TextRun({
          text: '\nDedicated as Sadaqa Jaria in memory of Al-Hajj Ahmed Khalil Faqih',
          font: 'Calibri',
          size: 18,
          italics: true,
          color: 'B45309', // Warm amber
        }),
      ],
    })
  );

  // Introduction Callout Paragraph
  docChildren.push(
    new Paragraph({
      alignment: AlignmentType.LEFT,
      spacing: { before: 100, after: 240 },
      children: [
        new TextRun({
          text: 'Introduction & Fiqh Summary: ',
          font: 'Calibri',
          size: 22,
          bold: true,
          color: '0F172A',
        }),
        new TextRun({
          text: 'Salat consists of Pillars (Arkan) without which the prayer is invalid, Obligations (Wajibat) compensated by Sujud as-Sahw if forgotten, and Sunnahs (Sunan) that elevate reward and contemplation (Khushū‘). This guide presents every authentic Prophetic invocation across the 11 bodily movements of prayer, verified from Sahih al-Bukhari, Sahih Muslim, Sunan Abi Dawud, Jami\' at-Tirmidhi, and Sunan an-Nasa\'i.',
          font: 'Calibri',
          size: 20,
          color: '334155',
        }),
      ],
    })
  );

  // Summary Table of Positions
  const tableRows: TableRow[] = [
    new TableRow({
      tableHeader: true,
      children: [
        new TableCell({
          width: { size: 10, type: WidthType.PERCENTAGE },
          shading: { fill: '064E3B', type: ShadingType.CLEAR },
          children: [new Paragraph({ children: [new TextRun({ text: '#', bold: true, color: 'FFFFFF', size: 18 })] })],
        }),
        new TableCell({
          width: { size: 40, type: WidthType.PERCENTAGE },
          shading: { fill: '064E3B', type: ShadingType.CLEAR },
          children: [new Paragraph({ children: [new TextRun({ text: 'Prayer Posture (Position)', bold: true, color: 'FFFFFF', size: 18 })] })],
        }),
        new TableCell({
          width: { size: 25, type: WidthType.PERCENTAGE },
          shading: { fill: '064E3B', type: ShadingType.CLEAR },
          children: [new Paragraph({ children: [new TextRun({ text: 'Ruling Category', bold: true, color: 'FFFFFF', size: 18 })] })],
        }),
        new TableCell({
          width: { size: 25, type: WidthType.PERCENTAGE },
          shading: { fill: '064E3B', type: ShadingType.CLEAR },
          children: [new Paragraph({ children: [new TextRun({ text: 'Repetitions', bold: true, color: 'FFFFFF', size: 18 })] })],
        }),
      ],
    }),
  ];

  SALAT_POSITION_CATEGORIES.forEach((cat) => {
    const recitations = SALAT_RECITATIONS.filter(r => r.positionCategory === cat.category);
    const essential = recitations.filter(r => r.ruling === 'pillar' || r.ruling === 'obligatory');
    
    tableRows.push(
      new TableRow({
        children: [
          new TableCell({
            width: { size: 10, type: WidthType.PERCENTAGE },
            children: [new Paragraph({ children: [new TextRun({ text: `${cat.order}`, bold: true, size: 18 })] })],
          }),
          new TableCell({
            width: { size: 40, type: WidthType.PERCENTAGE },
            children: [
              new Paragraph({
                children: [
                  new TextRun({ text: cat.nameEn, bold: true, size: 18, color: '0F172A' }),
                  new TextRun({ text: ` (${cat.nameAr})`, size: 18, color: '475569' }),
                ],
              }),
            ],
          }),
          new TableCell({
            width: { size: 25, type: WidthType.PERCENTAGE },
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: essential.length > 0 ? 'Pillar / Wajib Included' : 'Sunnah Mu\'akkadah',
                    size: 18,
                    bold: essential.length > 0,
                    color: essential.length > 0 ? 'B91C1C' : '047857',
                  }),
                ],
              }),
            ],
          }),
          new TableCell({
            width: { size: 25, type: WidthType.PERCENTAGE },
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: `${recitations.length} Invocations`,
                    size: 18,
                    color: '334155',
                  }),
                ],
              }),
            ],
          }),
        ],
      })
    );
  });

  docChildren.push(
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: tableRows,
    })
  );

  // 1.5 Fiqh Explanation Section: Understanding Pillars, Obligations, and Sunnahs
  docChildren.push(
    new Paragraph({
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 240, after: 80 },
      children: [
        new TextRun({
          text: 'ISLAMIC JURISPRUDENCE (FIQH): WHAT EACH SALAT RULING MEANS',
          bold: true,
          size: 24,
          color: '064E3B',
        }),
      ],
    }),
    new Paragraph({
      spacing: { before: 60, after: 140 },
      children: [
        new TextRun({
          text: 'Every prayer movement and recitation falls strictly into one of three jurisprudential ranks:\n',
          size: 20,
          color: '334155',
        }),
        new TextRun({
          text: '• 1. PILLARS (أركان الصلاة - 14 Arkan): ',
          bold: true,
          color: '991B1B',
          size: 20,
        }),
        new TextRun({
          text: 'The indispensable pillars upon which the validity of prayer depends (e.g., Takbirat al-Ihram, Surah Al-Fatihah, Ruku\', Standing upright, Sujud, Tranquility / Tum\'anīnah, Final Tashahhud, and the Tasleem). If omitted deliberately, the prayer is invalid (Batil). If forgotten, Sujud as-Sahw ALONE DOES NOT COMPENSATE for it; the missed pillar must be physically performed, followed by Sujud as-Sahw.\n\n',
          size: 20,
          color: '334155',
        }),
        new TextRun({
          text: '• 2. OBLIGATIONS (واجبات الصلاة - 8 Wajibat): ',
          bold: true,
          color: 'B45309',
          size: 20,
        }),
        new TextRun({
          text: 'Mandatory actions and sayings (e.g., all transition Takbirs, "Sami\' Allahu liman hamidah", "Rabbana lakal hamd", Tasbih in Ruku and Sujud at least once, Rabbi-ghfir li between prostrations, and the First Tashahhud with its sitting). Deliberate omission invalidates prayer. If omitted forgetfully, it is FULLY COMPENSATED by Sujud as-Sahw (two prostrations of forgetfulness before Salam).\n\n',
          size: 20,
          color: '334155',
        }),
        new TextRun({
          text: '• 3. SUNNAHS (سنن الصلاة - Sunan): ',
          bold: true,
          color: '047857',
          size: 20,
        }),
        new TextRun({
          text: 'Recommended verbal and physical practices taught by the Prophet ﷺ (e.g., Opening supplication / Istiftah, seeking refuge and Basmalah, reciting verses after Fatihah, raising hands at transition points, placing right hand over left, looking at the place of prostration, repeating tasbih 3+ times, and the Tawarruk sitting in the final Tashahhud). Omission does not invalidate prayer, and Sujud as-Sahw is not required, but performing them maximizes divine reward and devotion (Khushū‘).',
          size: 20,
          color: '334155',
        }),
      ],
    }),
    new Paragraph({ spacing: { before: 100, after: 140 } })
  );

  // 2. Iterate through each Category and its Recitations
  SALAT_POSITION_CATEGORIES.forEach((cat) => {
    let recitations = SALAT_RECITATIONS.filter(r => r.positionCategory === cat.category);
    if (filterRuling === 'essential') {
      recitations = recitations.filter(r => r.isEssential);
    }
    if (recitations.length === 0) return;

    // Category Header
    docChildren.push(
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 260, after: 100 },
        children: [
          new TextRun({
            text: `${cat.order}. ${cat.nameEn.toUpperCase()}`,
            bold: true,
            size: 26,
            color: '064E3B',
          }),
          new TextRun({
            text: `  •  ${cat.nameAr}`,
            bold: true,
            size: 26,
            font: 'Traditional Arabic',
            color: '064E3B',
          }),
        ],
      })
    );

    // Posture guidance & 3D image
    const imgBytes = includeImages ? imageBytesMap.get(cat.image3dUrl) : undefined;
    if (imgBytes) {
      docChildren.push(
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          borders: {
            top: { style: BorderStyle.SINGLE, size: 2, color: '064E3B' },
            bottom: { style: BorderStyle.SINGLE, size: 1, color: 'E2E8F0' },
            left: { style: BorderStyle.NONE },
            right: { style: BorderStyle.NONE },
            insideHorizontal: { style: BorderStyle.NONE },
            insideVertical: { style: BorderStyle.NONE },
          },
          rows: [
            new TableRow({
              children: [
                // Column 1: Action instructions
                new TableCell({
                  width: { size: 72, type: WidthType.PERCENTAGE },
                  shading: { fill: 'F8FAFC', type: ShadingType.CLEAR },
                  margins: { top: 100, bottom: 100, left: 120, right: 120 },
                  children: [
                    new Paragraph({
                      spacing: { before: 0, after: 40 },
                      children: [
                        new TextRun({
                          text: '3D POSTURE VIEW & ACTION GUIDANCE',
                          bold: true,
                          size: 16,
                          color: '064E3B',
                        }),
                      ],
                    }),
                    new Paragraph({
                      spacing: { before: 20, after: 60 },
                      children: [
                        new TextRun({
                          text: `Posture: `,
                          bold: true,
                          size: 17,
                          color: '334155',
                        }),
                        new TextRun({
                          text: cat.briefPostureEn,
                          italics: true,
                          size: 17,
                          color: '475569',
                        }),
                      ],
                    }),
                    new Paragraph({
                      bidirectional: true,
                      alignment: AlignmentType.RIGHT,
                      spacing: { before: 20, after: 0 },
                      children: [
                        new TextRun({
                          text: `التوجيه الشرعي: ${cat.briefPostureAr}`,
                          font: 'Traditional Arabic',
                          size: 20,
                          color: '064E3B',
                        }),
                      ],
                    }),
                  ],
                }),
                // Column 2: 3D Image
                new TableCell({
                  width: { size: 28, type: WidthType.PERCENTAGE },
                  shading: { fill: 'F8FAFC', type: ShadingType.CLEAR },
                  margins: { top: 80, bottom: 80, left: 80, right: 80 },
                  children: [
                    new Paragraph({
                      alignment: AlignmentType.CENTER,
                      spacing: { before: 0, after: 40 },
                      children: [
                        new ImageRun({
                          data: imgBytes,
                          type: 'jpg',
                          transformation: {
                            width: 110,
                            height: 110,
                          },
                        }),
                      ],
                    }),
                    new Paragraph({
                      alignment: AlignmentType.CENTER,
                      children: [
                        new TextRun({
                          text: '3D Salat Posture',
                          size: 14,
                          italics: true,
                          color: '64748B',
                        }),
                      ],
                    }),
                  ],
                }),
              ],
            }),
          ],
        })
      );
      docChildren.push(new Paragraph({ spacing: { before: 80, after: 80 } }));
    } else {
      docChildren.push(
        new Paragraph({
          spacing: { before: 40, after: 140 },
          children: [
            new TextRun({
              text: `Posture & Action: `,
              bold: true,
              italics: true,
              size: 18,
              color: '475569',
            }),
            new TextRun({
              text: `${cat.briefPostureEn} (التوجيه: ${cat.briefPostureAr})`,
              italics: true,
              size: 18,
              color: '64748B',
            }),
          ],
        })
      );
    }

    // Recitations inside this category
    recitations.forEach((item, rIdx) => {
      // Recitation Header (Title & Ruling Tag)
      docChildren.push(
        new Paragraph({
          heading: HeadingLevel.HEADING_3,
          spacing: { before: 140, after: 60 },
          children: [
            new TextRun({
              text: `${cat.order}.${rIdx + 1} ${item.titleEn}`,
              bold: true,
              size: 22,
              color: '0F172A',
            }),
            new TextRun({
              text: `  [${item.rulingLabelEn.split('(')[0].trim()}]`,
              bold: true,
              size: 18,
              color: item.ruling === 'pillar' ? 'B91C1C' : item.ruling === 'obligatory' ? 'B45309' : '047857',
            }),
            item.repeatCount > 1
              ? new TextRun({
                  text: `  •  Repeat: ${item.repeatCount}x`,
                  bold: true,
                  size: 18,
                  color: '0284C7',
                })
              : new TextRun({ text: '' }),
          ],
        })
      );

      // ARABIC TEXT (High priority, large font, bold, RTL)
      docChildren.push(
        new Paragraph({
          alignment: AlignmentType.RIGHT,
          bidirectional: true,
          spacing: { before: 60, after: 60 },
          children: [
            new TextRun({
              text: item.arabicText,
              font: 'Traditional Arabic',
              size: 32, // 16pt
              bold: true,
              rightToLeft: true,
              color: '064E3B',
            }),
          ],
        })
      );

      // Transliteration
      if (includeTransliteration && item.transliteration) {
        docChildren.push(
          new Paragraph({
            alignment: AlignmentType.LEFT,
            spacing: { before: 40, after: 40 },
            children: [
              new TextRun({
                text: 'Pronunciation: ',
                bold: true,
                size: 18,
                color: '0F766E',
              }),
              new TextRun({
                text: item.transliteration,
                italics: true,
                size: 19,
                color: '0F766E',
              }),
            ],
          })
        );
      }

      // English Translation
      if (includeEnglish && item.translationEn) {
        docChildren.push(
          new Paragraph({
            alignment: AlignmentType.LEFT,
            spacing: { before: 40, after: 40 },
            children: [
              new TextRun({
                text: 'English Meaning: ',
                bold: true,
                size: 19,
                color: '1E293B',
              }),
              new TextRun({
                text: `"${item.translationEn}"`,
                size: 20,
                color: '1E293B',
              }),
            ],
          })
        );
      }

      // Amharic Translation
      if (includeAmharic && item.translationAm) {
        docChildren.push(
          new Paragraph({
            alignment: AlignmentType.LEFT,
            spacing: { before: 40, after: 40 },
            children: [
              new TextRun({
                text: 'የአማርኛ ትርጉም: ',
                bold: true,
                size: 19,
                font: 'Nyala',
                color: '047857',
              }),
              new TextRun({
                text: item.translationAm,
                size: 19,
                font: 'Nyala',
                color: '047857',
              }),
            ],
          })
        );
      }

      // Hadith Source & Authenticity
      docChildren.push(
        new Paragraph({
          alignment: AlignmentType.LEFT,
          spacing: { before: 30, after: 40 },
          children: [
            new TextRun({
              text: 'Hadith Reference: ',
              bold: true,
              size: 17,
              color: '64748B',
            }),
            new TextRun({
              text: `${item.hadithReference} (${item.authenticityGrade})`,
              size: 17,
              italics: true,
              color: '64748B',
            }),
          ],
        })
      );

      // Deep Insight / Explanation Note
      if (includeNotes && item.explanationEn) {
        docChildren.push(
          new Paragraph({
            alignment: AlignmentType.LEFT,
            spacing: { before: 30, after: 120 },
            children: [
              new TextRun({
                text: 'Benefit & Significance: ',
                bold: true,
                size: 17,
                color: '854D0E',
              }),
              new TextRun({
                text: item.explanationEn,
                size: 17,
                color: '475569',
              }),
            ],
          })
        );
      }

      // Subtle separator line
      docChildren.push(
        new Paragraph({
          spacing: { before: 20, after: 60 },
          children: [
            new TextRun({
              text: '_________________________________________________________________________________',
              size: 12,
              color: 'E2E8F0',
            }),
          ],
        })
      );
    });
  });

  // Concluding Section
  docChildren.push(
    new Paragraph({
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 260, after: 100 },
      children: [
        new TextRun({
          text: 'GOLDEN RULES FOR KHUSHŪ‘ (DEVOTION) IN SALAT',
          bold: true,
          size: 24,
          color: '064E3B',
        }),
      ],
    })
  );

  const goldenRules = [
    '1. Tranquility (Tum\'anīnah): Pause in each posture until every bone and joint settles calmly into place without rushing.',
    '2. Contemplation of Meanings (Tadabbur): Reflect upon the Almighty in Ruku\', the Most High in Sujud, and our utter dependence before Him.',
    '3. Alternating Prophetic Invocations: Varying between authenticated prophetic opening and bowing supplications revitalizes presence of heart and wards off distraction.',
    '4. Perfecting the Ending Salam: Contemplate that your Salam conveys peace to the believers and guardian angels on your right and left.',
    '5. Post-Salat Remembrances: Never rush away; the Prophet ﷺ stated that reciting Ayat al-Kursi after each prayer guarantees Paradise upon death.'
  ];

  goldenRules.forEach((rule) => {
    docChildren.push(
      new Paragraph({
        bullet: { level: 0 },
        spacing: { before: 40, after: 40 },
        children: [
          new TextRun({
            text: rule,
            size: 20,
            color: '334155',
          }),
        ],
      })
    );
  });

  // Assemble the doc
  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 1000,
              right: 1000,
              bottom: 1000,
              left: 1000,
            },
          },
        },
        children: docChildren,
      },
    ],
  });

  return await Packer.toBlob(doc);
}

/**
 * Generates and triggers download of the Word document
 */
export async function downloadSalatRecitationsDocx(
  options: SalatExportOptions = {},
  filename = 'What_to_Recite_During_Salat_Guide.docx'
): Promise<void> {
  const blob = await generateSalatRecitationsDocx(options);
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
}

/**
 * Generates an elegant, standalone printable HTML window
 * specifically formatted for browser "Print to PDF / Save as PDF",
 * including 3D images of each Salat position.
 */
export async function printSalatRecitationsHTML(options: SalatExportOptions = {}): Promise<void> {
  const {
    includeTransliteration = true,
    includeEnglish = true,
    includeAmharic = true,
    includeNotes = true,
    includeImages = true,
    filterRuling = 'all'
  } = options;

  let recitationsToPrint = SALAT_RECITATIONS;
  if (filterRuling === 'essential') {
    recitationsToPrint = recitationsToPrint.filter(r => r.isEssential);
  }

  // Pre-load 3D images as Base64 for instant, synchronous print rendering
  const base64Map = new Map<string, string>();
  if (includeImages) {
    const uniqueUrls = Array.from(new Set(Object.values(SALAT_3D_POSTURE_IMAGES)));
    await Promise.all(
      uniqueUrls.map(async (url) => {
        const b64 = await fetchImageBase64(url);
        base64Map.set(url, b64);
      })
    );
  }

  // Group by category
  const categoriesHtml = SALAT_POSITION_CATEGORIES.map(cat => {
    const items = recitationsToPrint.filter(r => r.positionCategory === cat.category);
    if (items.length === 0) return '';

    const b64Img = includeImages ? base64Map.get(cat.image3dUrl) : undefined;

    const itemsHtml = items.map((item, idx) => {
      const translitHtml = includeTransliteration && item.transliteration 
        ? `<div style="font-style: italic; color: #047857; margin: 4px 0; font-size: 13px;">${item.transliteration}</div>`
        : '';
      const engHtml = includeEnglish && item.translationEn 
        ? `<div style="color: #1e293b; margin: 6px 0; font-size: 13px; line-height: 1.5;"><strong>Meaning:</strong> "${item.translationEn}"</div>`
        : '';
      const amHtml = includeAmharic && item.translationAm 
        ? `<div style="color: #065f46; margin: 4px 0; font-size: 12px; line-height: 1.4;"><strong>አማርኛ:</strong> ${item.translationAm}</div>`
        : '';
      const noteHtml = includeNotes && item.explanationEn 
        ? `<div style="color: #64748b; font-size: 11px; margin-top: 6px; padding: 6px 10px; background: #f8fafc; border-left: 3px solid #cbd5e1; border-radius: 4px;"><strong>Significance:</strong> ${item.explanationEn}</div>`
        : '';

      const rulingBadge = item.ruling === 'pillar'
        ? `<span style="background: #fee2e2; color: #991b1b; padding: 2px 6px; border-radius: 4px; font-weight: bold; font-size: 10px;">${item.rulingLabelEn}</span>`
        : item.ruling === 'obligatory'
          ? `<span style="background: #fef3c7; color: #92400e; padding: 2px 6px; border-radius: 4px; font-weight: bold; font-size: 10px;">${item.rulingLabelEn}</span>`
          : `<span style="background: #dcfce7; color: #166534; padding: 2px 6px; border-radius: 4px; font-weight: bold; font-size: 10px;">${item.rulingLabelEn}</span>`;

      const repeatBadge = item.repeatCount > 1 
        ? `<span style="background: #e0f2fe; color: #0369a1; padding: 2px 6px; border-radius: 4px; font-weight: bold; font-size: 10px; margin-left: 6px;">${item.repeatCount}x Repeats</span>`
        : '';

      return `
        <div style="border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px 14px; margin-bottom: 12px; page-break-inside: avoid; break-inside: avoid; background: #ffffff;">
          <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #f1f5f9; padding-bottom: 6px; margin-bottom: 8px;">
            <div style="font-weight: bold; font-size: 14px; color: #0f172a;">
              ${cat.order}.${idx + 1} ${item.titleEn}
              <span style="font-size: 13px; color: #64748b; margin-left: 6px;">(${item.titleAr})</span>
            </div>
            <div>
              ${rulingBadge}
              ${repeatBadge}
            </div>
          </div>

          <div style="direction: rtl; text-align: right; font-family: 'Amiri', 'Traditional Arabic', serif; font-size: 20px; font-weight: bold; color: #064e3b; line-height: 1.8; margin: 8px 0; padding: 6px 10px; background: #f0fdf4; border-radius: 6px;">
            ${item.arabicText}
          </div>

          ${translitHtml}
          ${engHtml}
          ${amHtml}
          
          <div style="font-size: 11px; color: #94a3b8; font-family: monospace; margin-top: 6px;">
            Reference: ${item.hadithReference} (${item.authenticityGrade})
          </div>

          ${noteHtml}
        </div>
      `;
    }).join('');

    return `
      <div style="margin-bottom: 24px; page-break-inside: avoid; break-inside: avoid;">
        <div style="background: #064e3b; color: #ffffff; padding: 8px 14px; border-radius: 6px; margin-bottom: 10px; display: flex; justify-content: space-between; align-items: center;">
          <h2 style="margin: 0; font-size: 16px; font-weight: bold;">${cat.order}. ${cat.nameEn}</h2>
          <span style="font-size: 16px; font-weight: bold; font-family: 'Traditional Arabic', serif;">${cat.nameAr}</span>
        </div>

        <div style="display: flex; align-items: center; justify-content: space-between; gap: 14px; margin-bottom: 12px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 10px 14px;">
          <div style="flex: 1;">
            <div style="font-size: 11px; font-weight: bold; color: #064e3b; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;">
              3D Posture Model & Motion Guide (هيئة الحركة ثلاثية الأبعاد)
            </div>
            <div style="font-size: 12px; color: #334155; line-height: 1.4;">
              <strong>Posture:</strong> ${cat.briefPostureEn}
            </div>
            <div style="font-size: 13px; color: #064e3b; font-family: 'Traditional Arabic', serif; direction: rtl; margin-top: 4px; font-weight: 600;">
              <strong>التوجيه الشرعي:</strong> ${cat.briefPostureAr}
            </div>
          </div>
          ${b64Img ? `
          <div style="flex-shrink: 0; text-align: center;">
            <img src="${b64Img}" alt="${cat.nameEn}" style="width: 100px; height: 100px; object-fit: cover; border-radius: 8px; border: 2px solid #064e3b; box-shadow: 0 2px 4px rgba(0,0,0,0.08);" />
            <div style="font-size: 9px; color: #64748b; font-weight: bold; margin-top: 2px;">3D Posture Model</div>
          </div>
          ` : ''}
        </div>

        ${itemsHtml}
      </div>
    `;
  }).join('');

  const fullHtml = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>What to Recite During Salat in Every Position - An-Noor Quran Companion</title>
      <style>
        @page {
          size: A4;
          margin: 15mm 15mm 15mm 15mm;
        }
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
          color: #0f172a;
          background: #ffffff;
          line-height: 1.4;
          padding: 10px;
          margin: 0;
        }
        @media print {
          body {
            padding: 0;
          }
          .no-print {
            display: none !important;
          }
        }
      </style>
    </head>
    <body>
      <div class="no-print" style="background: #064e3b; color: white; padding: 12px 18px; border-radius: 8px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center;">
        <div>
          <strong>Ready to Print / Save as PDF with 3D Postures</strong> — Click the button or press Ctrl+P / Cmd+P to save as PDF.
        </div>
        <button onclick="window.print()" style="background: #fbbf24; color: #78350f; border: none; font-weight: bold; padding: 8px 16px; border-radius: 6px; cursor: pointer; font-size: 14px;">
          🖨️ Print / Save as PDF
        </button>
      </div>

      <div style="text-align: center; border-bottom: 2px solid #064e3b; padding-bottom: 14px; margin-bottom: 18px;">
        <h1 style="color: #064e3b; margin: 0 0 6px 0; font-size: 24px;">WHAT TO RECITE DURING SALAT IN EVERY POSITION</h1>
        <div style="font-size: 20px; font-weight: bold; color: #064e3b; font-family: 'Traditional Arabic', serif; margin-bottom: 6px;">
          أذكار وأدعية الصلاة في كل ركن وموضع من هدي النبي ﷺ
        </div>
        <div style="font-size: 12px; color: #475569;">
          An-Noor Quran Companion • Complete Guide with 3D Postures, Full Tashkeel, Transliteration & Translations
        </div>
        <div style="font-size: 11px; color: #b45309; font-style: italic; margin-top: 3px;">
          Dedicated as Sadaqa Jaria in memory of Al-Hajj Ahmed Khalil Faqih
        </div>
      </div>

      <!-- Fiqh Jurisprudence Explanation: What Each Ruling Means -->
      <div style="background: #f8fafc; border: 1.5px solid #064e3b; border-radius: 8px; padding: 12px 16px; margin-bottom: 20px; page-break-inside: avoid; break-inside: avoid;">
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #cbd5e1; padding-bottom: 6px; margin-bottom: 10px;">
          <h3 style="margin: 0; font-size: 14px; font-weight: bold; color: #064e3b; text-transform: uppercase; letter-spacing: 0.5px;">
            Fiqh of Salat: What Each Ruling Means (بيان مراتب أحكام الصلاة)
          </h3>
          <span style="font-size: 11px; font-weight: bold; color: #b45309; background: #fef3c7; padding: 2px 8px; border-radius: 4px;">
            Pillars • Obligations • Sunnahs
          </span>
        </div>
        <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; font-size: 11px; line-height: 1.45;">
          <div style="background: #ffffff; border: 1px solid #fecaca; border-radius: 6px; padding: 8px 10px;">
            <div style="font-weight: bold; color: #991b1b; margin-bottom: 4px; font-size: 12px;">1. PILLARS (الأركان - 14)</div>
            <div style="color: #334155;"><strong>Definition:</strong> Foundational components upon which prayer validity depends.</div>
            <div style="color: #b91c1c; margin-top: 3px;"><strong>Deliberate:</strong> Prayer is invalid (Batil).</div>
            <div style="color: #991b1b; margin-top: 2px;"><strong>Forgetful:</strong> Must make up the missed pillar + Sujud as-Sahw. Sahw alone does NOT compensate!</div>
          </div>
          <div style="background: #ffffff; border: 1px solid #fde68a; border-radius: 6px; padding: 8px 10px;">
            <div style="font-weight: bold; color: #92400e; margin-bottom: 4px; font-size: 12px;">2. OBLIGATIONS (الواجبات - 8)</div>
            <div style="color: #334155;"><strong>Definition:</strong> Mandatory acts (Takbirs, Sami Allahu, Rabbana, Tasbih, 1st Tashahhud).</div>
            <div style="color: #b91c1c; margin-top: 3px;"><strong>Deliberate:</strong> Prayer is invalid (Batil).</div>
            <div style="color: #92400e; margin-top: 2px;"><strong>Forgetful:</strong> Fully compensated by Sujud as-Sahw before Salam.</div>
          </div>
          <div style="background: #ffffff; border: 1px solid #bbf7d0; border-radius: 6px; padding: 8px 10px;">
            <div style="font-weight: bold; color: #166534; margin-bottom: 4px; font-size: 12px;">3. SUNNAHS (السنن - Sunan)</div>
            <div style="color: #334155;"><strong>Definition:</strong> Voluntary verbal & physical acts (Istiftah, raising hands, Tawarruk).</div>
            <div style="color: #166534; margin-top: 3px;"><strong>Deliberate:</strong> Prayer remains completely valid.</div>
            <div style="color: #166534; margin-top: 2px;"><strong>Forgetful:</strong> Prayer is valid; no Sujud as-Sahw is required.</div>
          </div>
        </div>
      </div>

      ${categoriesHtml}

      <div style="margin-top: 20px; padding: 12px; background: #f8fafc; border-top: 2px solid #064e3b; border-radius: 6px; font-size: 11px; color: #475569; text-align: center;">
        © ${new Date().getFullYear()} An-Noor Quran Companion • Grounded in Sahih al-Bukhari, Sahih Muslim, Sunan Abi Dawud, At-Tirmidhi, and An-Nasa'i.
      </div>

      <script>
        window.onload = function() {
          // Allow fonts and images to settle before triggering print
          setTimeout(function() {
            window.print();
          }, 450);
        };
      </script>
    </body>
    </html>
  `;

  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.open();
    printWindow.document.write(fullHtml);
    printWindow.document.close();
  } else {
    // If popups are blocked by browser, fallback to standard window.print()
    window.print();
  }
}
