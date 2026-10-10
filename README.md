# JARVIS — Website

Statische Website, kein Build-Schritt. Alle Dateien liegen flach in einem Ordner.
**Wichtig: Alle 6 Dateien müssen zusammen hochgeladen werden, sonst sieht die Seite kaputt aus.**

```
index.html     Seitenstruktur
styles.css     Design
data.js        ZENTRALE DATENQUELLE: Releases, Funktionen, Integrationen
app.js         Logik (normalerweise nicht ändern)
favicon.svg    Icon
vercel.json    Vercel-Einstellungen
```

## Wartung: alles in `data.js`

| Aufgabe | Was tun |
| --- | --- |
| Neue Version | Neuen Eintrag in `releases` ergänzen, alte nie löschen |
| Installationsdatei | HTTPS-URL in `downloadUrl` eintragen, SHA-256 in `checksum` |
| Neue Funktion | Eintrag in `functions` ergänzen |
| Neue Integration | Eintrag in `integrations` ergänzen |
| Beispieldaten entfernen | `showSampleData: false`, dann Einträge mit `sample: true` löschen |
| Kopier-/Zoomschutz aus | `protectContent: false` |

Ohne gültige `downloadUrl` (beginnt mit `https://` oder `/downloads/`) bleibt der Download-Button deaktiviert ("Coming soon").

## Auf Vercel veröffentlichen (über GitHub)

1. Auf github.com ein neues Repository anlegen.
2. "uploading an existing file" wählen und alle 6 Dateien auf einmal hineinziehen. Commit klicken.
3. Auf vercel.com mit GitHub anmelden: Add New → Project → Repository importieren.
4. Framework Preset "Other" lassen, Build Command und Output Directory leer lassen, Deploy klicken.
5. Spätere Änderungen an `data.js` direkt auf GitHub bearbeiten (Stift-Symbol), Vercel veröffentlicht automatisch neu.

Große Installer als GitHub Release hosten und die `https://`-URL in `downloadUrl` eintragen.
