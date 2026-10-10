/* =============================================================================
   JARVIS — ZENTRALE DATENQUELLE
   -----------------------------------------------------------------------------
   Das ist die EINZIGE Datei, die du bei Updates anfassen musst.
   Alles andere (Startseite, Download-Button, Update-Hinweis, Library,
   Functions-Sektion) wird automatisch daraus erzeugt.

   WARTUNG IN KURZFORM
   1. Neue Version veröffentlichen  -> neuen Eintrag in `releases` ergänzen.
      (Alte Einträge NIE löschen, sie bilden das Archiv.)
   2. Neue Funktion                  -> Eintrag in `functions` ergänzen.
   3. Neue Integration / Dienst      -> Eintrag in `integrations` ergänzen.
   4. Beispieldaten entfernen        -> `siteConfig.showSampleData = false`
      setzen und später alle Einträge mit `sample: true` löschen.

   INSTALLATIONSDATEIEN
   Die eigentliche Installationsdatei (.exe, .dmg, .zip ...) ist NICHT Teil
   dieser Website-Vorlage. Lade sie später selbst hoch, zum Beispiel als
   GitHub-Release oder in den Ordner /downloads, und trage die HTTPS-URL im
   Feld `downloadUrl` des passenden Release ein. Solange `downloadUrl` leer
   ist, zeigt die Website "Coming soon" bzw. "Download unavailable" und tut
   niemals so, als gäbe es einen funktionierenden Download.
   ========================================================================== */

window.JARVIS_DATA = (function () {
  'use strict';

  /* ---------------------------------------------------------------------------
     siteConfig — allgemeine Einstellungen
     ------------------------------------------------------------------------ */
  const siteConfig = {
    name: 'JARVIS',

    // true  = Einträge mit `sample: true` werden angezeigt (Entwicklung/Demo).
    // false = nur echte Einträge sind sichtbar (Produktion).
    // Ist false und es gibt keine echten Releases, erscheint weder die
    // Update-Leiste noch ein Download.
    showSampleData: true,
  };

  /* ---------------------------------------------------------------------------
     releases — ALLE veröffentlichten Versionen (Archiv)

     Pflichtfelder pro Eintrag:
       version            "1.2"          (ohne führendes "v")
       generation         1              (Zahl)
       releaseDate        "2026-09-15"   (ISO-Datum JJJJ-MM-TT)
       description        Kurzbeschreibung
       changelog          { added: [], fixed: [], changed: [] }
       downloadUrl        "https://..." oder "/downloads/..." — leer = kein Download
       status             "published" | "archived" | "draft"
       systemRequirements ["Windows 11 ...", ...]

     Optional:
       platform           z. B. "Windows x64"
       checksum           SHA-256 der Datei (empfohlen!)
       sample             true = Beispieldaten, KEINE echte Veröffentlichung

     status:
       published -> normal sichtbar, kann "Latest" werden
       archived  -> sichtbar, wird als "Archived" markiert, wird nie "Latest"
       draft     -> komplett unsichtbar (zum Vorbereiten)

     Die NEUESTE Version wird automatisch bestimmt: das jüngste
     `releaseDate` unter allen "published"-Einträgen (bei Gleichstand die
     höhere Generation/Version). Du musst nichts "als aktuell markieren".
     ------------------------------------------------------------------------ */
  const releases = [
    // >>> NEUE RELEASES HIER ERGÄNZEN (Reihenfolge egal) <<<

    // ----- BEISPIELDATEN (sample: true) — keine echten Veröffentlichungen -----
    {
      version: '1.2',
      generation: 1,
      releaseDate: '2026-09-15',
      description: 'Sample entry. Replace with the real description of this release.',
      changelog: {
        added: ['Sample: new feature description'],
        fixed: ['Sample: bug fix description'],
        changed: ['Sample: change description'],
      },
      downloadUrl: '', // <-- echte HTTPS-URL der Installationsdatei eintragen
      checksum: '',    // <-- SHA-256 der Datei eintragen
      platform: '',
      status: 'published',
      systemRequirements: ['Sample: operating system', 'Sample: memory / storage'],
      sample: true,
    },
    {
      version: '1.1',
      generation: 1,
      releaseDate: '2026-08-01',
      description: 'Sample entry. Replace with the real description of this release.',
      changelog: {
        added: ['Sample: new feature description'],
        fixed: ['Sample: bug fix description'],
        changed: [],
      },
      downloadUrl: '',
      checksum: '',
      platform: '',
      status: 'published',
      systemRequirements: ['Sample: operating system'],
      sample: true,
    },
    {
      version: '1.0',
      generation: 1,
      releaseDate: '2026-06-01',
      description: 'Sample entry. Replace with the real description of the first release.',
      changelog: {
        added: ['Sample: initial release'],
        fixed: [],
        changed: [],
      },
      downloadUrl: '',
      checksum: '',
      platform: '',
      status: 'published',
      systemRequirements: ['Sample: operating system'],
      sample: true,
    },
  ];

  /* ---------------------------------------------------------------------------
     functions — Funktionen von JARVIS (Functions-Sektion)

     Pflichtfelder: id, name, description, category, status, integrations
     category: "core" | "ai" | "automation"
     status:   "available"      -> erscheint in seiner Kategorie
               "in-development" -> erscheint unter "Upcoming Features"
               "planned"        -> erscheint unter "Upcoming Features"
     Optional: compatibility, requirements (Text), sample: true

     WICHTIG: Trage hier nur Funktionen ein, die wirklich existieren oder
     ausdrücklich als geplant gekennzeichnet sind. Bei JEDER neuen
     JARVIS-Funktion diese Liste aktualisieren.
     ------------------------------------------------------------------------ */
  const functions = [
    // >>> NEUE FUNKTIONEN HIER ERGÄNZEN <<<

    // ----- BEISPIELDATEN -----
    {
      id: 'sample-core',
      name: 'Sample core function',
      description: 'Placeholder. Replace with a real core function of JARVIS.',
      category: 'core',
      status: 'available',
      integrations: [],
      compatibility: '',
      sample: true,
    },
    {
      id: 'sample-ai',
      name: 'Sample AI capability',
      description: 'Placeholder. Replace with a real AI capability of JARVIS.',
      category: 'ai',
      status: 'available',
      integrations: [],
      sample: true,
    },
    {
      id: 'sample-automation',
      name: 'Sample automation',
      description: 'Placeholder. Replace with a real automation feature.',
      category: 'automation',
      status: 'available',
      integrations: ['Sample service'],
      sample: true,
    },
    {
      id: 'sample-upcoming',
      name: 'Sample upcoming feature',
      description: 'Placeholder for a feature that is clearly marked as planned.',
      category: 'core',
      status: 'planned',
      integrations: [],
      sample: true,
    },
  ];

  /* ---------------------------------------------------------------------------
     integrations — Verbindungen zu externen Diensten

     Pflichtfelder: id, name, description, category, status
     category: "integrations" (Verbindungen) | "services" (unterstützte Dienste)
     status:   "available" | "in-development" | "planned"
     Optional: compatibility, sample: true

     Behaupte hier niemals eine Verbindung, die technisch noch nicht
     umgesetzt ist. Nicht fertige Dinge -> "planned" oder "in-development".
     ------------------------------------------------------------------------ */
  const integrations = [
    // >>> NEUE INTEGRATIONEN / DIENSTE HIER ERGÄNZEN <<<

    // ----- BEISPIELDATEN -----
    {
      id: 'sample-integration',
      name: 'Sample integration',
      description: 'Placeholder. Replace with a real integration.',
      category: 'integrations',
      status: 'available',
      sample: true,
    },
    {
      id: 'sample-service',
      name: 'Sample service',
      description: 'Placeholder. Replace with a real supported service.',
      category: 'services',
      status: 'available',
      sample: true,
    },
  ];

  /* ---------------------------------------------------------------------------
     systemRequirements — Systemvoraussetzungen (allgemein, versionsübergreifend)
     Versionsspezifische Anforderungen gehören in `releases[].systemRequirements`.
     ------------------------------------------------------------------------ */
  const systemRequirements = [
    { label: 'Operating system', value: 'To be announced', sample: true },
    { label: 'Memory', value: 'To be announced', sample: true },
    { label: 'Storage', value: 'To be announced', sample: true },
  ];

  return { siteConfig, releases, functions, integrations, systemRequirements };
})();
