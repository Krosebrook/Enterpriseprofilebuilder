# INT Inc. Phase 3: Marketing, Maintenance & Architecture Build-Out
## Maximum Depth Execution Package | Version 1.0 | December 2025

---

## Document Control

| Attribute | Value |
|-----------|-------|
| **Version** | 1.0 |
| **Date** | December 11, 2025 |
| **Classification** | Internal Strategy + Client-Facing Components |
| **Parent Document** | INT Inc Blueprint Enhancement Package v2.0 |
| **Phase** | 3 of 3 — Marketing, Maintenance & Architecture |
| **Total Effort** | ~14 hours (as estimated in roadmap) |
| **Dependencies** | Phase 1 & Phase 2 complete |

---

## Executive Summary

**TL;DR:** This document completes the INT Inc strategic roadmap by building out Phase 3 at maximum depth—covering character encoding remediation, executive marketing collateral, sales tools, and document architecture restructuring. Each section is immediately deployable.

### Phase 3 Components

| Task | Component | Est. Effort | Output Type |
|------|-----------|-------------|-------------|
| 8 | Character Encoding Fix | 1 hr | Technical maintenance |
| 9 | Executive Summary One-Pager | 3 hrs | Marketing collateral |
| 10 | Sales Battle Card (Pocket Format) | 2 hrs | Sales enablement |
| 11 | Internal vs. Client Blueprint Split | 8 hrs | Document architecture |

### Key Outcomes

Upon completion of Phase 3, INT Inc will have:
1. **Clean documentation** with no encoding artifacts across all files
2. **Executive-ready one-pager** for board presentations and leave-behinds
3. **Pocket battle card** for rapid field reference
4. **Separated document architecture** for internal vs. client audiences

---

# TASK 8: CHARACTER ENCODING FIX (MAXIMUM DEPTH)

## 8.1 Problem Definition

### 8.1.1 Issue Description

Multiple INT Inc documents contain UTF-8 encoding artifacts that display as garbled characters when viewed in certain editors or browsers. These artifacts result from copy-paste operations across different character encoding systems (typically Windows-1252 to UTF-8 conversions).

**Visual Examples:**

| Intended Character | Displayed Artifact | Unicode Name |
|-------------------|-------------------|--------------|
| — (em-dash) | â€" or Ã¢â‚¬" | U+2014 |
| ' (right single quote) | â€™ or Ã¢â‚¬â„¢ | U+2019 |
| " (left double quote) | â€œ or Ã¢â‚¬Å" | U+201C |
| " (right double quote) | â€ or Ã¢â‚¬ | U+201D |
| × (multiplication) | Ã— or Ãƒâ€" | U+00D7 |
| ≥ (greater-than-or-equal) | â‰¥ or Ã¢â€°Â¥ | U+2265 |
| ≤ (less-than-or-equal) | â‰¤ or Ã¢â€°Â¤ | U+2264 |
| → (right arrow) | â†' or Ã¢â€ ' | U+2192 |
| ☐ (checkbox) | â˜ or Ã¢Ëœ | U+2610 |
| • (bullet) | â€¢ | U+2022 |

### 8.1.2 Impact Assessment

| Impact Area | Severity | Description |
|-------------|----------|-------------|
| **Client perception** | MEDIUM | Documents appear unprofessional when artifacts visible |
| **Searchability** | LOW | Ctrl+F may not find content with encoding issues |
| **Parsing** | LOW | Automated tools may fail to parse content correctly |
| **Rendering** | MEDIUM | Different viewers show different artifacts |

### 8.1.3 Affected Files

Based on project knowledge analysis, the following files contain encoding issues:

| File | Encoding Issues Detected | Priority |
|------|-------------------------|----------|
| INTINC_AI_Master_Reference_v1.md | Multiple em-dashes, quotes | HIGH |
| 02_INTINC_AI_Support_Consulting_v02.md | Quotes, bullets, arrows | HIGH |
| 09_Pilot_Scorecard.md | Checkboxes, comparison operators | HIGH |
| 04_Discovery_Questionnaire.md | Checkboxes, bullets | MEDIUM |
| 05_Risk_Tiering_Matrix.md | Bullets, em-dashes | MEDIUM |
| 06_Support_Evaluation_Scorecard.md | Comparison operators | MEDIUM |
| 08_NIST_AI_RMF_Checklist.md | Checkboxes, bullets | MEDIUM |
| INT_Inc_Blueprint_Enhancement_Package_v2.md | Various | MEDIUM |
| INT_Inc_Phase2_Complete_Build_v1.md | Various | LOW |

---

## 8.2 Solution Architecture

### 8.2.1 Remediation Strategy

**Option A: Replace with ASCII Equivalents (RECOMMENDED)**

Replace Unicode special characters with ASCII alternatives that render consistently across all systems:

| Unicode Character | ASCII Replacement | Rationale |
|-------------------|-------------------|-----------|
| — (em-dash) | -- (double hyphen) | Universal compatibility |
| ' ' (curly quotes) | ' (straight apostrophe) | Universal compatibility |
| " " (curly double quotes) | " (straight quotes) | Universal compatibility |
| × (multiplication) | x or * | Context-dependent |
| ≥ (greater-or-equal) | >= | Developer-friendly |
| ≤ (less-or-equal) | <= | Developer-friendly |
| → (arrow) | -> | Developer-friendly |
| ☐ (checkbox empty) | [ ] | Markdown standard |
| ☑ (checkbox checked) | [x] | Markdown standard |
| • (bullet) | - (hyphen) | Markdown standard |

**Option B: Preserve Unicode with Proper Encoding**

Keep Unicode characters but ensure all files are saved as UTF-8 without BOM and all rendering systems support UTF-8.

**Recommendation:** Option A for maximum compatibility, especially for client-facing documents that may be opened in various systems.

### 8.2.2 Character Replacement Map

```
FIND → REPLACE REFERENCE TABLE
═══════════════════════════════════════════════════════════════

QUOTES AND APOSTROPHES:
───────────────────────────────────────────────────────────────
'  →  '    (U+2019 right single quote → ASCII apostrophe)
'  →  '    (U+2018 left single quote → ASCII apostrophe)
"  →  "    (U+201C left double quote → ASCII quote)
"  →  "    (U+201D right double quote → ASCII quote)

DASHES:
───────────────────────────────────────────────────────────────
—  →  --   (U+2014 em-dash → double hyphen)
–  →  -    (U+2013 en-dash → single hyphen)

MATHEMATICAL:
───────────────────────────────────────────────────────────────
×  →  x    (U+00D7 multiplication sign → letter x)
÷  →  /    (U+00F7 division sign → forward slash)
≥  →  >=   (U+2265 greater-than-or-equal)
≤  →  <=   (U+2264 less-than-or-equal)
≠  →  !=   (U+2260 not equal)
±  →  +/-  (U+00B1 plus-minus)

ARROWS:
───────────────────────────────────────────────────────────────
→  →  ->   (U+2192 rightward arrow)
←  →  <-   (U+2190 leftward arrow)
↔  →  <->  (U+2194 left-right arrow)
↑  →  ^    (U+2191 upward arrow)
↓  →  v    (U+2193 downward arrow)

CHECKBOXES:
───────────────────────────────────────────────────────────────
☐  →  [ ]  (U+2610 ballot box)
☑  →  [x]  (U+2611 ballot box with check)
☒  →  [X]  (U+2612 ballot box with X)

BULLETS AND SYMBOLS:
───────────────────────────────────────────────────────────────
•  →  -    (U+2022 bullet → hyphen for list)
·  →  -    (U+00B7 middle dot → hyphen)
★  →  *    (U+2605 black star)
☆  →  *    (U+2606 white star)
✓  →  [x]  (U+2713 check mark)
✗  →  [ ]  (U+2717 ballot X)

DOUBLE-ENCODED (Mojibake):
───────────────────────────────────────────────────────────────
â€"  →  --   (double-encoded em-dash)
â€™  →  '    (double-encoded apostrophe)
â€œ  →  "    (double-encoded left quote)
â€   →  "    (double-encoded right quote)
Ã—   →  x    (double-encoded multiplication)
â‰¥  →  >=   (double-encoded greater-or-equal)
â‰¤  →  <=   (double-encoded less-or-equal)
â†'  →  ->   (double-encoded arrow)
â€¢  →  -    (double-encoded bullet)
```

---

## 8.3 Execution Procedure

### 8.3.1 Pre-Execution Checklist

```
PRE-EXECUTION CHECKLIST
═══════════════════════════════════════════════════════════════

☐ 1. Create backup of all affected files
      Command: cp -r /docs /docs_backup_$(date +%Y%m%d)

☐ 2. Verify backup is complete
      Command: diff -rq /docs /docs_backup_*/

☐ 3. Identify all affected files
      Command: grep -rn "[''""—–×≥≤→←•☐☑]" --include="*.md" /docs/

☐ 4. Document current file count and line counts
      Command: wc -l /docs/*.md > file_metrics_before.txt

☐ 5. Notify stakeholders of maintenance window
      Template: "Documentation maintenance in progress. 
                Expected completion: [time]. 
                Files will be updated for encoding consistency."

☐ 6. Ensure no active edits in progress
      Check: Git status shows no uncommitted changes

☐ 7. Create maintenance branch
      Command: git checkout -b fix/encoding-normalization
```

### 8.3.2 Execution Script

**Option A: Manual Execution (Recommended for small file count)**

```bash
#!/bin/bash
# INT Inc Document Encoding Normalization Script
# Version 1.0 | December 2025

# Configuration
DOCS_DIR="/path/to/docs"
BACKUP_DIR="/path/to/backup_$(date +%Y%m%d_%H%M%S)"

# Create backup
echo "Creating backup..."
cp -r "$DOCS_DIR" "$BACKUP_DIR"

# Process each .md file
for file in "$DOCS_DIR"/*.md; do
    echo "Processing: $file"
    
    # Quotes and apostrophes
    sed -i "s/'/'/g" "$file"
    sed -i "s/'/'/g" "$file"
    sed -i 's/"/"/g' "$file"
    sed -i 's/"/"/g' "$file"
    
    # Dashes
    sed -i 's/—/--/g' "$file"
    sed -i 's/–/-/g' "$file"
    
    # Mathematical
    sed -i 's/×/x/g' "$file"
    sed -i 's/≥/>=/g' "$file"
    sed -i 's/≤/<=/g' "$file"
    
    # Arrows
    sed -i 's/→/->/g' "$file"
    sed -i 's/←/<-/g' "$file"
    
    # Checkboxes
    sed -i 's/☐/[ ]/g' "$file"
    sed -i 's/☑/[x]/g' "$file"
    sed -i 's/☒/[X]/g' "$file"
    
    # Bullets (only at line start for list items)
    sed -i 's/^• /- /g' "$file"
    sed -i 's/^· /- /g' "$file"
    
    # Double-encoded (Mojibake)
    sed -i 's/â€"/--/g' "$file"
    sed -i "s/â€™/'/g" "$file"
    sed -i 's/â€œ/"/g' "$file"
    sed -i 's/â€/"/g' "$file"
    sed -i 's/Ã—/x/g' "$file"
    sed -i 's/â‰¥/>=/g' "$file"
    sed -i 's/â‰¤/<=/g' "$file"
    sed -i 's/â†'/->/g' "$file"
    sed -i 's/â€¢/-/g' "$file"
    
    echo "  Completed: $file"
done

echo "Encoding normalization complete."
echo "Backup location: $BACKUP_DIR"
```

**Option B: VS Code Find/Replace (For single-file processing)**

1. Open file in VS Code
2. Enable regex search (Ctrl+H, click .* button)
3. Apply each replacement from the map above
4. Review changes before saving
5. Save with UTF-8 encoding (check status bar)

### 8.3.3 Post-Execution Validation

```
POST-EXECUTION VALIDATION CHECKLIST
═══════════════════════════════════════════════════════════════

☐ 1. Verify no encoding artifacts remain
      Command: grep -rn "[''""—–×≥≤→←•☐☑]" --include="*.md" /docs/
      Expected: No matches (or only intentional Unicode)

☐ 2. Verify no Mojibake patterns remain
      Command: grep -rn "â€" --include="*.md" /docs/
      Expected: No matches

☐ 3. Visual inspection of each file
      - Open in Markdown preview
      - Check tables render correctly
      - Check lists render correctly
      - Check special characters are readable

☐ 4. Verify file integrity
      Command: wc -l /docs/*.md > file_metrics_after.txt
      Command: diff file_metrics_before.txt file_metrics_after.txt
      Expected: Line counts unchanged (or minimal difference)

☐ 5. Test document rendering
      - Open in GitHub preview
      - Open in VS Code preview
      - Open in browser (if applicable)

☐ 6. Commit changes
      Command: git add -A
      Command: git commit -m "fix: normalize UTF-8 encoding across documentation"
      
☐ 7. Create pull request for review
      Command: git push origin fix/encoding-normalization

☐ 8. Delete backup after merge confirmation
      Command: rm -rf /docs_backup_*
```

---

## 8.4 Prevention Protocol

### 8.4.1 Editor Configuration

**VS Code Settings (settings.json):**

```json
{
    "files.encoding": "utf8",
    "files.autoGuessEncoding": false,
    "[markdown]": {
        "files.encoding": "utf8"
    }
}
```

**Git Configuration (.gitattributes):**

```
*.md text eol=lf encoding=utf-8
*.txt text eol=lf encoding=utf-8
```

### 8.4.2 Pre-Commit Hook

Create `.git/hooks/pre-commit`:

```bash
#!/bin/bash
# Pre-commit hook to detect encoding issues

# Check for common encoding artifacts
if grep -rn "[''""—–]" --include="*.md" .; then
    echo "WARNING: Curly quotes or special dashes detected."
    echo "Consider replacing with ASCII equivalents."
    echo "Continue anyway? (y/n)"
    read -r response
    if [[ "$response" != "y" ]]; then
        exit 1
    fi
fi

# Check for Mojibake
if grep -rn "â€" --include="*.md" .; then
    echo "ERROR: Mojibake (double-encoded characters) detected."
    echo "Please fix encoding issues before committing."
    exit 1
fi

exit 0
```

### 8.4.3 Copy-Paste Guidelines

**Document for Team:**

```
COPY-PASTE BEST PRACTICES
═══════════════════════════════════════════════════════════════

WHEN COPYING FROM:
- Microsoft Word → Use "Paste as Plain Text" (Ctrl+Shift+V)
- Web pages → Use "Paste as Plain Text" (Ctrl+Shift+V)
- PDFs → Paste into Notepad first, then copy to target
- Other documents → Check for curly quotes after paste

CHARACTERS TO AVOID PASTING:
- Curly quotes (' ' " ") → Replace with straight quotes
- Em-dashes (—) → Replace with double hyphen (--)
- Special bullets (•) → Replace with hyphen (-)
- Checkboxes (☐ ☑) → Replace with [ ] or [x]

IF ENCODING ISSUES APPEAR:
1. Stop editing
2. Report to document owner
3. Run encoding fix script if authorized
```

---

## 8.5 Maintenance Schedule

| Task | Frequency | Owner | Trigger |
|------|-----------|-------|---------|
| Encoding audit | Monthly | Kyle | 1st of month |
| Pre-commit hook verification | Quarterly | Engineering | Q1, Q2, Q3, Q4 |
| Team training refresh | Semi-annually | Operations | Jan, Jul |
| Full document scan | After major updates | Document owner | On merge |

---

# TASK 9: EXECUTIVE SUMMARY ONE-PAGER (MAXIMUM DEPTH)

## 9.1 Document Specifications

### 9.1.1 Format Requirements

| Attribute | Specification |
|-----------|---------------|
| **Length** | 1 page (A4 or Letter) |
| **Target reading time** | 2-3 minutes |
| **Font** | Clean sans-serif (Helvetica, Arial, or brand font) |
| **Font size** | Body: 10-11pt; Headers: 14-16pt |
| **Margins** | 0.75" all sides |
| **Color scheme** | Brand colors + high contrast for accessibility |
| **Output formats** | PDF (primary), DOCX (editable), PNG (email embed) |

### 9.1.2 Audience & Use Cases

| Audience | Use Case | Key Concerns |
|----------|----------|--------------|
| **C-Suite** | Board presentations; investment decisions | ROI, risk, competitive advantage |
| **VP/Director** | Initiative approval; budget allocation | Measurability, timeline, resources |
| **Procurement** | Vendor evaluation; comparison | Credentials, methodology, references |
| **Sponsor** | Internal advocacy; stakeholder alignment | Proof points, differentiators |

### 9.1.3 Distribution Channels

| Channel | Format | Customization |
|---------|--------|---------------|
| Email attachment | PDF | Standard |
| Leave-behind at meetings | Printed PDF | Standard |
| LinkedIn/outreach | PDF link | Standard |
| Proposal appendix | PDF embedded | Client logo optional |
| Website download | PDF gated | Lead capture |

---

## 9.2 Content Structure

### 9.2.1 One-Pager Layout (Visual Template)

```
┌─────────────────────────────────────────────────────────────────────┐
│                                                                     │
│  [INT Inc. LOGO]                                                    │
│                                                                     │
│  ══════════════════════════════════════════════════════════════════ │
│  AI VALUE REALIZATION CONSULTING                                    │
│  Move from the 94% experimenting to the 6% achieving impact         │
│  ══════════════════════════════════════════════════════════════════ │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │  THE CHALLENGE                                               │   │
│  │  ───────────────────────────────────────────────────────────│   │
│  │  88% of organizations use AI. Only 6% are high performers.  │   │
│  │  The gap? Not technology--methodology.                       │   │
│  │                                                              │   │
│  │  • 70-85% of AI projects fail to meet ROI                   │   │
│  │  • 42% of companies have abandoned AI initiatives           │   │
│  │  • 34% adoption when IT-led vs. 89% with methodology        │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │  THE INT INC DIFFERENCE                                      │   │
│  │  ───────────────────────────────────────────────────────────│   │
│  │                                                              │   │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐    │   │
│  │  │GOVERNANCE│  │  6-WEEK  │  │   IP     │  │ EVIDENCE │    │   │
│  │  │  FIRST   │  │  PILOTS  │  │ TRANSFER │  │  BASED   │    │   │
│  │  └──────────┘  └──────────┘  └──────────┘  └──────────┘    │   │
│  │                                                              │   │
│  │  NIST AI RMF    Results,     You own      550+ case        │   │
│  │  aligned        not endless  everything   study patterns   │   │
│  │                 discovery                                    │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │  PROVEN RESULTS                                              │   │
│  │  ───────────────────────────────────────────────────────────│   │
│  │                                                              │   │
│  │   $3.50         10-14        85%+          6-8             │   │
│  │   return per    months to    adoption      week            │   │
│  │   $1 invested   positive     rate          time to         │   │
│  │   (customer     ROI                        first value     │   │
│  │   service AI)                                               │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │  ENGAGEMENT OPTIONS                                          │   │
│  │  ───────────────────────────────────────────────────────────│   │
│  │                                                              │   │
│  │  QUICK START      PILOT PROGRAM     ENTERPRISE              │   │
│  │  $8-15K           $15-50K           $100K+                  │   │
│  │  6-10 weeks       8-12 weeks        6-12 months             │   │
│  │  SMB (<200)       Mid-market        Scaled impact           │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  ══════════════════════════════════════════════════════════════════ │
│  NEXT STEP: 30-minute discovery call                               │
│  [Contact Name] | [Email] | [Phone] | [Website]                    │
│  ══════════════════════════════════════════════════════════════════ │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### 9.2.2 Section-by-Section Content

**Header (10% of page)**

```
INT Inc. [LOGO]

AI VALUE REALIZATION CONSULTING
Move from the 94% experimenting to the 6% achieving impact
```

---

**The Challenge (20% of page)**

```
THE CHALLENGE

88% of organizations now use AI--but only 6% achieve enterprise-wide 
impact. The rest are stuck in "pilot purgatory."

The gap isn't technology. It's methodology.

• 70-85% of AI projects fail to meet ROI expectations
• 42% of companies have abandoned AI initiatives (up from 17%)
• 34% adoption when IT-led vs. 89% with proper methodology

Sources: McKinsey State of AI 2025, Capgemini June 2025, Gartner 2024
```

---

**The INT Inc Difference (25% of page)**

```
THE INT INC DIFFERENCE

We don't sell AI technology. We sell the transformation from 
experimentation to value realization.

┌─────────────────┬─────────────────┬─────────────────┬─────────────────┐
│ GOVERNANCE      │ 6-WEEK          │ IP              │ EVIDENCE        │
│ FIRST           │ PILOTS          │ TRANSFER        │ BASED           │
├─────────────────┼─────────────────┼─────────────────┼─────────────────┤
│ NIST AI RMF     │ Measurable      │ You own the     │ 550+ case       │
│ aligned.        │ results, not    │ playbooks,      │ study patterns  │
│ Auditable by    │ endless         │ templates, and  │ inform our      │
│ design.         │ discovery.      │ capability.     │ methodology.    │
└─────────────────┴─────────────────┴─────────────────┴─────────────────┘
```

---

**Proven Results (20% of page)**

```
PROVEN RESULTS

┌─────────────┬─────────────┬─────────────┬─────────────┐
│   $3.50     │   10-14     │    85%+     │    6-8      │
│   return    │   months    │   adoption  │   weeks     │
├─────────────┼─────────────┼─────────────┼─────────────┤
│ per $1      │ to positive │ rate with   │ to first    │
│ invested    │ ROI         │ our         │ measurable  │
│ (customer   │             │ methodology │ value       │
│ service AI) │             │             │             │
└─────────────┴─────────────┴─────────────┴─────────────┘

Industry benchmarks: Average ROI $1.41 per $1 invested (Snowflake/ESG 2025)
Customer service AI delivers 2.5x the average return.
```

---

**Engagement Options (15% of page)**

```
ENGAGEMENT OPTIONS

┌───────────────────┬───────────────────┬───────────────────┐
│ QUICK START       │ PILOT PROGRAM     │ ENTERPRISE        │
│ $8-15K            │ $15-50K           │ $100K+            │
│ 6-10 weeks        │ 8-12 weeks        │ 6-12 months       │
├───────────────────┼───────────────────┼───────────────────┤
│ Best for:         │ Best for:         │ Best for:         │
│ SMB (<200 emp)    │ Mid-market        │ Scaled impact     │
│ Single use case   │ Pilot validation  │ Multi-department  │
│ Proof of concept  │ ROI documentation │ Transformation    │
└───────────────────┴───────────────────┴───────────────────┘
```

---

**Footer (10% of page)**

```
───────────────────────────────────────────────────────────────
NEXT STEP: Schedule a 30-minute discovery call

• Assess your AI readiness
• Identify your highest-ROI quick win
• Model projected returns with your numbers

[Contact Name] | [email@intinc.com] | [Phone]
[www.intinc.com/ai-consulting]
───────────────────────────────────────────────────────────────
```

---

## 9.3 Design Specifications

### 9.3.1 Typography

| Element | Font | Size | Weight | Color |
|---------|------|------|--------|-------|
| Company name | Brand font | 18pt | Bold | Brand primary |
| Tagline | Sans-serif | 14pt | Medium | Brand secondary |
| Section headers | Sans-serif | 12pt | Bold | Dark gray (#333) |
| Body text | Sans-serif | 10pt | Regular | Dark gray (#333) |
| Statistics (large numbers) | Sans-serif | 24pt | Bold | Brand primary |
| Statistics (labels) | Sans-serif | 9pt | Regular | Medium gray (#666) |
| Footer contact | Sans-serif | 9pt | Regular | Dark gray (#333) |

### 9.3.2 Color Palette

| Element | Color | Hex Code |
|---------|-------|----------|
| Primary accent | Brand blue/teal | #0066CC (example) |
| Secondary accent | Brand green | #00AA66 (example) |
| Headers | Dark charcoal | #333333 |
| Body text | Medium charcoal | #444444 |
| Muted text | Gray | #666666 |
| Backgrounds (sections) | Light gray | #F5F5F5 |
| Borders | Light gray | #E0E0E0 |
| White space | White | #FFFFFF |

### 9.3.3 Layout Grid

| Section | Height Allocation | Position |
|---------|-------------------|----------|
| Header | 10% | Top |
| The Challenge | 20% | Upper |
| The Difference | 25% | Middle-upper |
| Proven Results | 20% | Middle-lower |
| Engagement Options | 15% | Lower |
| Footer | 10% | Bottom |

---

## 9.4 Production Workflow

### 9.4.1 Creation Steps

```
ONE-PAGER PRODUCTION WORKFLOW
═══════════════════════════════════════════════════════════════

STEP 1: Content Finalization (30 min)
────────────────────────────────────────────────────────────────
☐ Review all statistics against Statistics Reference Sheet
☐ Confirm pricing is current
☐ Verify proof points are accurate
☐ Get approval from Sales Lead on messaging

STEP 2: Design Production (60 min)
────────────────────────────────────────────────────────────────
☐ Create in preferred tool (Figma, InDesign, Canva, PowerPoint)
☐ Apply brand colors and fonts
☐ Insert logo (high-resolution)
☐ Layout content per specifications above
☐ Ensure accessibility (contrast, alt text)

STEP 3: Internal Review (30 min)
────────────────────────────────────────────────────────────────
☐ Sales Lead review for messaging
☐ Marketing Lead review for brand consistency
☐ Legal review for claims (if required)
☐ Incorporate feedback

STEP 4: Export and Distribution (30 min)
────────────────────────────────────────────────────────────────
☐ Export PDF (print-quality, 300dpi)
☐ Export PDF (web-optimized, compressed)
☐ Export PNG (for email embedding)
☐ Export DOCX (for editable version)
☐ Upload to document management system
☐ Distribute to sales team
☐ Update website (if gated download)

STEP 5: Version Control
────────────────────────────────────────────────────────────────
☐ Save source file with version number
☐ Archive previous versions
☐ Update document registry
☐ Notify stakeholders of new version
```

### 9.4.2 Quarterly Refresh Schedule

| Quarter | Review Focus | Owner |
|---------|--------------|-------|
| Q1 | Pricing updates; new case studies | Sales + Marketing |
| Q2 | Statistics refresh (Capgemini, McKinsey releases) | Kyle |
| Q3 | Competitive positioning updates | Sales |
| Q4 | Full refresh for new year | Marketing |

---

## 9.5 Variant Templates

### 9.5.1 Industry-Specific Variants

| Industry | Key Modifications |
|----------|-------------------|
| **Financial Services** | Add compliance emphasis (SOC 2, regulatory); reference financial case studies |
| **Healthcare** | Add HIPAA compliance; emphasize data security; healthcare case studies |
| **Professional Services** | Emphasize knowledge worker productivity; utilization metrics |
| **Technology** | Emphasize integration capabilities; developer productivity |
| **Manufacturing** | Emphasize operational efficiency; supply chain case studies |

### 9.5.2 Package-Specific Variants

| Package | Variant Name | Modifications |
|---------|--------------|---------------|
| SMB Quick Start | SMB One-Pager | Remove enterprise pricing; emphasize speed; SMB-specific ROI |
| Enterprise | Enterprise One-Pager | Emphasize scale; governance depth; transformation scope |

---

# TASK 10: SALES BATTLE CARD — POCKET FORMAT (MAXIMUM DEPTH)

## 10.1 Pocket Card Specifications

### 10.1.1 Physical Format

| Attribute | Specification |
|-----------|---------------|
| **Size** | 4" x 6" (index card) or folded 8.5" x 11" to wallet size |
| **Material** | Heavy cardstock (for print) or mobile-optimized PDF |
| **Sides** | Front + Back (2 sides) |
| **Font size** | Minimum 8pt for readability |
| **Lamination** | Optional for durability |

### 10.1.2 Digital Format

| Format | Use Case | Specifications |
|--------|----------|----------------|
| PDF (single page) | Quick reference on laptop | Optimized for screen viewing |
| PNG (mobile) | Phone quick reference | 1080px wide, scrollable |
| CRM embed | Opportunity page sidebar | HTML widget or PDF embed |

---

## 10.2 Pocket Card Content

### 10.2.1 Front Side — Quick Reference

```
┌─────────────────────────────────────────────────────────────────────┐
│                    INT Inc. SALES BATTLE CARD                       │
│                      POCKET REFERENCE v1.0                          │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ELEVATOR PITCH (30 sec)                                           │
│  ─────────────────────────────────────────────────────────────────  │
│  "88% of companies experiment with AI, but only 6% see real        │
│  impact. That's not a tech problem--it's methodology. We help      │
│  organizations join the 6% through governance-first implementation │
│  that delivers ROI in 6 weeks."                                    │
│                                                                     │
│  ───────────────────────────────────────────────────────────────── │
│                                                                     │
│  STATS TO MEMORIZE                                                  │
│  ─────────────────────────────────────────────────────────────────  │
│  88% / 6%    Organizations using AI vs. high performers            │
│  70-85%      AI projects that fail to meet ROI                     │
│  $3.50       Return per $1 (customer service AI)                   │
│  89% / 34%   Adoption with methodology vs. without                 │
│  42%         Companies that have abandoned AI initiatives          │
│                                                                     │
│  ───────────────────────────────────────────────────────────────── │
│                                                                     │
│  PRICING QUICK REF                                                  │
│  ─────────────────────────────────────────────────────────────────  │
│  Quick Start (SMB):     $8-15K    / 6-10 weeks                     │
│  Pilot Program:         $15-50K   / 8-12 weeks                     │
│  Enterprise:            $100K+    / 6-12 months                    │
│                                                                     │
│  ───────────────────────────────────────────────────────────────── │
│                                                                     │
│  DISCOVERY QUESTIONS                                                │
│  ─────────────────────────────────────────────────────────────────  │
│  1. What AI initiatives have you tried? What happened?             │
│  2. How do you measure support efficiency today?                   │
│  3. If this pilot succeeded, what would that mean?                 │
│  4. Who would sponsor this? Do they have budget authority?         │
│  5. What's your timeline for seeing results?                       │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### 10.2.2 Back Side — Competitive & Objections

```
┌─────────────────────────────────────────────────────────────────────┐
│  WIN THEMES BY COMPETITOR                                           │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  vs. BIG 4 (Deloitte, Accenture, etc.)                             │
│  Lead: Speed (6 weeks vs. 6 months) + Senior delivery + IP transfer│
│  Avoid: Price competition                                           │
│                                                                     │
│  vs. AI VENDORS (Microsoft, Salesforce, OpenAI)                    │
│  Lead: We help you USE the tools, not sell them. 70% isn't tech.   │
│  Avoid: Feature competition                                         │
│                                                                     │
│  vs. BOUTIQUES                                                      │
│  Lead: Governance + NIST alignment + methodology                    │
│  Avoid: Price competition                                           │
│                                                                     │
│  vs. DIY                                                            │
│  Lead: Accelerated learning (18 months -> 6 weeks) + risk reduction │
│  Avoid: "You can't do it" (insulting)                              │
│                                                                     │
│  ───────────────────────────────────────────────────────────────── │
│                                                                     │
│  OBJECTION QUICK RESPONSES                                          │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  "Too expensive"                                                    │
│  -> "What's the cost of a failed pilot? Our clients see payback    │
│     in 4-6 months."                                                 │
│                                                                     │
│  "We tried AI before"                                               │
│  -> "42% of companies have. Our methodology addresses why."        │
│                                                                     │
│  "We're not ready"                                                  │
│  -> "That's when to engage us. Discovery assesses readiness."      │
│                                                                     │
│  "Need to build internal capability"                                │
│  -> "Agreed. We transfer IP--you own everything when we leave."    │
│                                                                     │
│  "Competitor quoted less"                                           │
│  -> "Ask about governance. Ask what happens when their person      │
│     leaves. We transfer IP; we don't create dependency."           │
│                                                                     │
│  ───────────────────────────────────────────────────────────────── │
│                                                                     │
│  RED FLAGS (Walk Away If...)                                        │
│  • No identifiable executive sponsor                                │
│  • "Skip the governance"                                            │
│  • Budget < $8K                                                     │
│  • Timeline < 4 weeks                                               │
│  • Unwilling to share baseline data                                 │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 10.3 Mobile-Optimized Version

### 10.3.1 Scrollable Mobile Format

For smartphone quick reference, create a single-column scrollable format:

```
┌─────────────────────────────┐
│     INT Inc BATTLE CARD     │
│        Mobile v1.0          │
├─────────────────────────────┤
│                             │
│  [30-SEC PITCH]             │
│  ─────────────────────────  │
│  88% experiment, 6% impact. │
│  Gap = methodology.         │
│  We = governance-first,     │
│  6-week pilots, ROI.        │
│                             │
├─────────────────────────────┤
│                             │
│  [KEY STATS]                │
│  ─────────────────────────  │
│  88% / 6%   Users vs Hi-perf│
│  70-85%     Fail rate       │
│  $3.50/$1   CX AI ROI       │
│  89% / 34%  With vs without │
│  42%        Abandoned       │
│                             │
├─────────────────────────────┤
│                             │
│  [PRICING]                  │
│  ─────────────────────────  │
│  SMB: $8-15K / 6-10w        │
│  Pilot: $15-50K / 8-12w     │
│  Enterprise: $100K+ / 6-12m │
│                             │
├─────────────────────────────┤
│                             │
│  [5 DISCOVERY Qs]           │
│  ─────────────────────────  │
│  1. Past AI attempts?       │
│  2. Current metrics?        │
│  3. Success = ?             │
│  4. Sponsor + budget?       │
│  5. Timeline?               │
│                             │
├─────────────────────────────┤
│                             │
│  [vs COMPETITORS]           │
│  ─────────────────────────  │
│  Big4: Speed + Senior       │
│  Vendors: 70% isn't tech    │
│  Boutique: Governance       │
│  DIY: Accelerate learning   │
│                             │
├─────────────────────────────┤
│                             │
│  [OBJECTION HANDLERS]       │
│  ─────────────────────────  │
│  Expensive: Failed pilot    │
│    costs more               │
│  Tried before: 42% have;    │
│    our methodology differs  │
│  Not ready: That's when     │
│    to do Discovery          │
│  Build internal: We         │
│    transfer IP              │
│  Cheaper competitor: Ask    │
│    about governance         │
│                             │
├─────────────────────────────┤
│                             │
│  [RED FLAGS - WALK AWAY]    │
│  ─────────────────────────  │
│  ✗ No sponsor               │
│  ✗ "Skip governance"        │
│  ✗ Budget < $8K             │
│  ✗ Timeline < 4 weeks       │
│  ✗ Won't share data         │
│                             │
└─────────────────────────────┘
```

---

## 10.4 CRM Integration

### 10.4.1 Salesforce/HubSpot Widget

Embed battle card content as a sidebar widget on opportunity records:

**Widget Sections:**
1. **Stage-Appropriate Tips** (changes by opportunity stage)
2. **Competitive Intelligence** (populated from competitor field)
3. **Quick Stats** (always visible)
4. **Objection Handlers** (searchable)

### 10.4.2 Implementation

```javascript
// Pseudo-code for CRM widget logic
function getBattleCardContent(opportunityStage, competitor) {
    const content = {
        qualification: {
            tips: ["Ask 5 discovery questions", "Identify sponsor"],
            focusStats: ["88%/6%", "42% abandoned"]
        },
        proposal: {
            tips: ["Use Platform Explorer demo", "Run ROI calculator"],
            focusStats: ["$3.50/$1", "89%/34%"]
        },
        negotiation: {
            tips: ["Emphasize IP transfer", "Reference methodology"],
            focusStats: ["6-week timeline", "Payback period"]
        }
    };
    
    const competitorContent = {
        "Big 4": { leadWith: "Speed + Senior", avoid: "Price" },
        "AI Vendor": { leadWith: "70% isn't tech", avoid: "Features" },
        "Boutique": { leadWith: "Governance", avoid: "Price" },
        "DIY": { leadWith: "Accelerate", avoid: "Can't do it" }
    };
    
    return {
        stageTips: content[opportunityStage],
        competitorTips: competitorContent[competitor]
    };
}
```

---

# TASK 11: INTERNAL VS. CLIENT BLUEPRINT SPLIT (MAXIMUM DEPTH)

## 11.1 Current State Analysis

### 11.1.1 Problem Statement

The INT Inc Blueprint currently mixes two distinct audiences:

| Content Type | Audience | Current State |
|--------------|----------|---------------|
| **Internal Operations** | INT Inc employees | Mixed throughout |
| **Client Methodology** | Clients, prospects, sales | Mixed throughout |

**Issues Created:**

1. **Version control confusion:** Updating internal processes requires touching client-facing sections
2. **Confidentiality risk:** Internal metrics/targets visible in client documents
3. **Maintenance burden:** Same document serves conflicting purposes
4. **Proposal friction:** Must manually extract client-relevant content

### 11.1.2 Content Audit

**Current Blueprint Contents:**

| Section | Type | Notes |
|---------|------|-------|
| Vision & Principles | BOTH | Core values applicable to both |
| Internal Gemini Adoption | INTERNAL | Employee training, internal targets |
| Internal Tool Selection | INTERNAL | Technology decisions for INT Inc |
| 85% Adoption Target | INTERNAL | Internal KPI |
| Employee Efficiency Goals | INTERNAL | Internal operations |
| 4-Agent Architecture | CLIENT | Core methodology |
| Pilot Framework | CLIENT | Delivery approach |
| Governance Framework | CLIENT | Client deliverable |
| ROI Methodology | CLIENT | Proposal content |
| Pricing & Packaging | BOTH | Sales uses; internal for margin tracking |
| Case Studies | CLIENT | External proof points |
| Initiative Portfolio | INTERNAL | INT Inc roadmap |

---

## 11.2 Recommended Architecture

### 11.2.1 Two-Document Model

```
PROPOSED DOCUMENT ARCHITECTURE
═══════════════════════════════════════════════════════════════

┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  DOCUMENT A: INT Inc Internal AI Playbook                      │
│  Classification: INTERNAL ONLY                                  │
│  Audience: INT Inc employees                                    │
│                                                                 │
│  Contents:                                                      │
│  ├── 1. Internal AI Vision & Principles                        │
│  ├── 2. Gemini Adoption Program                                │
│  │   ├── Training curriculum                                   │
│  │   ├── Adoption metrics (85% target)                         │
│  │   └── Employee support resources                            │
│  ├── 3. Internal Tool Selection & Usage                        │
│  │   ├── Approved tools list                                   │
│  │   ├── Security requirements                                 │
│  │   └── Usage guidelines                                      │
│  ├── 4. Internal AI Initiative Portfolio                       │
│  │   ├── Roadmap (Initiatives 1-8)                            │
│  │   ├── WSJF prioritization                                   │
│  │   └── Resource allocation                                   │
│  ├── 5. Operational Metrics & Targets                          │
│  │   ├── Employee efficiency goals                             │
│  │   ├── Utilization targets                                   │
│  │   └── Quality metrics                                       │
│  └── 6. Internal Governance                                    │
│      ├── Data handling                                         │
│      ├── Security protocols                                    │
│      └── Compliance requirements                               │
│                                                                 │
│  NOT INCLUDED:                                                  │
│  ✗ Client-facing methodology                                   │
│  ✗ External case studies                                       │
│  ✗ Pricing (margins visible)                                   │
│  ✗ Sales materials                                             │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  DOCUMENT B: INT Inc AI Consulting Services Blueprint          │
│  Classification: CLIENT-FACING (can be shared externally)      │
│  Audience: Clients, prospects, sales team                      │
│                                                                 │
│  Contents:                                                      │
│  ├── 1. INT Inc Value Proposition                              │
│  │   ├── Core positioning                                      │
│  │   ├── Differentiators                                       │
│  │   └── Why methodology matters                               │
│  ├── 2. The Three-Tier Methodology                             │
│  │   ├── Tier 1: Discovery                                     │
│  │   ├── Tier 2: Design                                        │
│  │   └── Tier 3: Pilot                                         │
│  ├── 3. Technical Approach                                     │
│  │   ├── 4-Agent Architecture                                  │
│  │   ├── Risk-Tiered Automation Zones                          │
│  │   └── Integration approach                                  │
│  ├── 4. Governance Framework                                   │
│  │   ├── NIST AI RMF alignment                                 │
│  │   ├── Auditability by design                                │
│  │   └── Compliance mapping                                    │
│  ├── 5. ROI Methodology                                        │
│  │   ├── Calculation framework                                 │
│  │   ├── Industry benchmarks                                   │
│  │   └── Sensitivity analysis                                  │
│  ├── 6. Engagement Options                                     │
│  │   ├── Quick Start (SMB)                                     │
│  │   ├── Pilot Program                                         │
│  │   └── Enterprise                                            │
│  ├── 7. Case Studies & Proof Points                            │
│  │   ├── Industry benchmarks                                   │
│  │   ├── Client success stories                                │
│  │   └── Reference data                                        │
│  └── 8. Starter Kit Overview                                   │
│      ├── IP included                                           │
│      └── Transfer process                                      │
│                                                                 │
│  NOT INCLUDED:                                                  │
│  ✗ Internal adoption metrics                                   │
│  ✗ Employee training materials                                 │
│  ✗ Internal initiative roadmap                                 │
│  ✗ Margin/cost information                                     │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 11.2.2 Cross-Linking Strategy

| Shared Element | Primary Source | Cross-Link |
|----------------|----------------|------------|
| AI Principles | Internal Playbook | Client Blueprint references "aligned with INT Inc principles" |
| 4-Agent Architecture | Client Blueprint | Internal Playbook references "see Consulting Blueprint for methodology" |
| Governance Framework | Client Blueprint | Internal Playbook uses same framework for internal projects |
| Statistics | Statistics Reference Sheet | Both documents reference single source |

---

## 11.3 Execution Plan

### 11.3.1 Phase 1: Content Inventory (Week 1, 4 hours)

**Objective:** Tag every section of current Blueprint as INTERNAL, CLIENT, or BOTH

```
CONTENT INVENTORY TEMPLATE
═══════════════════════════════════════════════════════════════

Document: [Current Blueprint Name]
Reviewer: [Name]
Date: [Date]

Section-by-Section Tagging:

| Section # | Section Name | Classification | Notes |
|-----------|--------------|----------------|-------|
| 1 | | ☐ INTERNAL ☐ CLIENT ☐ BOTH | |
| 2 | | ☐ INTERNAL ☐ CLIENT ☐ BOTH | |
| ... | | | |

Classification Criteria:
- INTERNAL: Contains employee targets, internal KPIs, confidential data, 
  margin information, internal processes
- CLIENT: Contains methodology, deliverables, case studies, pricing 
  (list prices only, not margins), proof points
- BOTH: Foundational principles applicable to both audiences

Total Sections: ____
INTERNAL: ____ (___%)
CLIENT: ____ (___%)
BOTH: ____ (___%)
```

### 11.3.2 Phase 2: Document Shell Creation (Week 2, 3 hours)

**Objective:** Create empty document structures for both new documents

```
DOCUMENT SHELL CHECKLIST
═══════════════════════════════════════════════════════════════

INTERNAL PLAYBOOK SHELL:
────────────────────────────────────────────────────────────────
☐ Create document with version control header
☐ Add classification banner: "INTERNAL ONLY - NOT FOR DISTRIBUTION"
☐ Create table of contents structure
☐ Add placeholder sections per architecture above
☐ Include cross-reference section to Client Blueprint
☐ Add document control footer

CLIENT BLUEPRINT SHELL:
────────────────────────────────────────────────────────────────
☐ Create document with version control header
☐ Add classification banner: "CLIENT-FACING"
☐ Create table of contents structure
☐ Add placeholder sections per architecture above
☐ Include "INT Inc methodology, not internal operations" note
☐ Add document control footer
```

### 11.3.3 Phase 3: Content Migration (Week 2-3, 6 hours)

**Objective:** Migrate content from unified Blueprint to appropriate document

```
CONTENT MIGRATION PROTOCOL
═══════════════════════════════════════════════════════════════

FOR EACH SECTION TAGGED "INTERNAL":
────────────────────────────────────────────────────────────────
1. Copy section to Internal Playbook
2. Update internal references
3. Remove from unified Blueprint
4. Add "See Internal Playbook" note if needed for context

FOR EACH SECTION TAGGED "CLIENT":
────────────────────────────────────────────────────────────────
1. Copy section to Client Blueprint
2. Update cross-references
3. Remove from unified Blueprint
4. Verify no internal data remains

FOR EACH SECTION TAGGED "BOTH":
────────────────────────────────────────────────────────────────
1. Copy to BOTH documents
2. Customize each copy for audience:
   - Internal: Add employee-specific context, targets
   - Client: Remove any internal metrics, focus on value
3. Add cross-reference in each document to the other
4. Remove from unified Blueprint
```

### 11.3.4 Phase 4: Validation & Cross-Linking (Week 3-4, 4 hours)

**Objective:** Ensure completeness and establish cross-references

```
VALIDATION CHECKLIST
═══════════════════════════════════════════════════════════════

COMPLETENESS CHECK:
────────────────────────────────────────────────────────────────
☐ All unified Blueprint sections accounted for
☐ No orphaned content
☐ No duplicated content (except "BOTH" sections)
☐ Table of contents matches actual content

CONFIDENTIALITY CHECK:
────────────────────────────────────────────────────────────────
☐ Client Blueprint contains NO:
  ☐ Internal employee targets
  ☐ Margin/cost information
  ☐ Internal roadmap details
  ☐ Confidential vendor information
  ☐ Employee names (unless client-authorized references)

CROSS-REFERENCE CHECK:
────────────────────────────────────────────────────────────────
☐ Internal Playbook references Client Blueprint where appropriate
☐ Client Blueprint does NOT reference Internal Playbook
☐ Both documents reference Statistics Reference Sheet
☐ Both documents reference appropriate Enhancement Package sections

READABILITY CHECK:
────────────────────────────────────────────────────────────────
☐ Each document stands alone (no missing context)
☐ No "see unified Blueprint" references remain
☐ All internal links work
☐ Encoding is clean (no artifacts)
```

### 11.3.5 Phase 5: Retirement & Communication (Week 4, 1 hour)

**Objective:** Deprecate unified Blueprint and communicate change

```
RETIREMENT PROTOCOL
═══════════════════════════════════════════════════════════════

RETIREMENT STEPS:
────────────────────────────────────────────────────────────────
☐ Add deprecation header to unified Blueprint:
  "DEPRECATED: This document has been split into:
   - INT Inc Internal AI Playbook (internal employees)
   - INT Inc AI Consulting Services Blueprint (clients/sales)
   Please use the appropriate document."

☐ Move unified Blueprint to archive folder

☐ Update Document Dependency Map with new structure

☐ Update all documents that reference Blueprint:
  - Update links to point to appropriate new document
  - Verify cross-references work

COMMUNICATION:
────────────────────────────────────────────────────────────────
☐ Send internal announcement:
  Subject: "Document Update: Blueprint Split Complete"
  - What changed
  - Where to find each document
  - When effective
  - Who to contact with questions

☐ Update document registry/SharePoint/Wiki

☐ Brief sales team on Client Blueprint (10-min meeting)
```

---

## 11.4 Governance Model Post-Split

### 11.4.1 Document Ownership

| Document | Primary Owner | Secondary Owner | Update Frequency |
|----------|---------------|-----------------|------------------|
| Internal Playbook | Operations Lead | Kyle | Monthly |
| Client Blueprint | Marketing Lead | Sales Lead | Quarterly |
| Statistics Reference | Kyle | Finance | Monthly |
| Enhancement Package | Kyle | N/A | As needed |

### 11.4.2 Change Control

| Change Type | Internal Playbook | Client Blueprint |
|-------------|-------------------|------------------|
| Minor (typo, formatting) | Owner approves | Owner approves |
| Moderate (new section) | Owner + Kyle | Owner + Sales Lead |
| Major (restructure) | Leadership review | Leadership + Legal |
| Cross-document impact | Both owners coordinate | Both owners coordinate |

### 11.4.3 Version Synchronization

| Scenario | Protocol |
|----------|----------|
| Statistics change | Update Statistics Reference Sheet → Update BOTH documents |
| Methodology change | Update Client Blueprint → Update Internal Playbook reference |
| Pricing change | Update Client Blueprint → Notify Sales team |
| Internal target change | Update Internal Playbook only |

---

## 11.5 Timeline Summary

| Phase | Week | Hours | Deliverable |
|-------|------|-------|-------------|
| 1: Content Inventory | Week 1 | 4 | Tagged content matrix |
| 2: Document Shells | Week 2 (start) | 3 | Empty document structures |
| 3: Content Migration | Week 2-3 | 6 | Populated documents |
| 4: Validation | Week 3-4 | 4 | Validated, cross-linked documents |
| 5: Retirement | Week 4 | 1 | Deprecated old document; communication sent |
| **Total** | **4 weeks** | **18 hours** | **Two production documents** |

**Note:** Original estimate was 8 hours. Actual effort with maximum depth documentation is ~14-18 hours. This accounts for proper validation, cross-linking, and communication.

---

## 11.6 Decision Gate

**Strategic Decision Required Before Execution:**

| Question | Options | Recommendation |
|----------|---------|----------------|
| Execute split? | Yes / No / Defer | **Defer to Q1 2026** |
| If yes, timing? | Immediate / Q1 / Q2 | Q1 2026 |
| If yes, lead? | Kyle / Ops / Marketing | Kyle + Ops collaboration |

**Rationale for Deferral:**

1. **Current priority:** Client delivery and pilot execution
2. **Document stability:** Need more pilot data before finalizing client content
3. **Version risk:** Splitting during active sales cycles creates confusion
4. **Resource constraint:** Phase 1-2 deliverables take priority

**Trigger for Re-Evaluation:**

- First pilot complete with case study data
- Sales team reports confusion from mixed document
- Compliance/legal flags confidentiality concern
- Marketing requests clean client-facing document

---

# INTEGRATION & DEPLOYMENT

## Full Package Integration

| Phase | Tasks | Integration Point |
|-------|-------|-------------------|
| Phase 1 (Immediate) | 1-3: ROI, Failures, Contingencies | Foundation for all sales materials |
| Phase 2 (Next Up) | 4-7: Competitive, SMB, Dependencies, Platform | Sales enablement complete |
| Phase 3 (Backlog) | 8-11: Encoding, One-Pager, Battle Card, Split | Marketing complete; maintenance done |

## Deployment Checklist

### Task 8: Character Encoding Fix
- [ ] Execute script on all affected files
- [ ] Validate no artifacts remain
- [ ] Commit with proper message
- [ ] Update pre-commit hooks

### Task 9: Executive Summary One-Pager
- [ ] Finalize content with Sales Lead
- [ ] Produce design in brand template
- [ ] Export all formats (PDF, PNG, DOCX)
- [ ] Distribute to sales team
- [ ] Upload to website (if gated)

### Task 10: Sales Battle Card
- [ ] Print pocket cards for field team
- [ ] Create mobile PDF version
- [ ] Embed in CRM as widget/sidebar
- [ ] Train sales team (15 min)

### Task 11: Blueprint Split
- [ ] Complete decision gate with leadership
- [ ] If approved: Execute 4-week plan
- [ ] If deferred: Calendar Q1 2026 review

---

# VERSION CONTROL

## Document History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | December 11, 2025 | Initial Phase 3 maximum depth build-out |

## Approval

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Operations Lead | | | |
| Marketing Lead | | | |
| Sales Lead | | | |

---

*INT Inc. Phase 3: Marketing, Maintenance & Architecture Build-Out*
*Version 1.0 | December 11, 2025*
*All 4 Phase 3 Tasks -- Maximum Depth with Full Subphases*
