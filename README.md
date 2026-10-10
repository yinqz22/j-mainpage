# JARVIS — Website

Statische Website (HTML, CSS, JavaScript). Kein Build-Schritt, keine Abhängigkeiten.

## Struktur

```
index.html        Seitenstruktur
css/styles.css    Design (dunkel, silber)
js/data.js        ZENTRALE DATENQUELLE: releases, functions, integrations
js/app.js         Logik (liest nur aus data.js, hier ändert man nichts)
favicon.svg
vercel.json       Vercel-Konfiguration (Header)
```

## Lokal ansehen

Einfach `index.html` im Browser öffnen, oder mit einem lokalen Server:

```
npx serve .
```

## Wartung: alles passiert in `js/data.js`

| Aufgabe | Was tun |
| --- | --- |
| Neue Version veröffentlichen | Neuen Eintrag in `releases` ergänzen. Alte Einträge nie löschen. |
| Installationsdatei bereitstellen | Datei hochladen (GitHub Release oder `/downloads`), HTTPS-URL in `downloadUrl` eintragen, SHA-256 in `checksum` |
| Neue Funktion | Eintrag in `functions` ergänzen (`available`, `in-development` oder `planned`) |
| Neue Integration / Dienst | Eintrag in `integrations` ergänzen |
| Beispieldaten entfernen | `siteConfig.showSampleData = false`, danach alle Einträge mit `sample: true` löschen |

Die neueste Version wird automatisch bestimmt (jüngstes `releaseDate` unter allen
`published`-Einträgen). Startseiten-Download, Update-Leiste und Library-Hervorhebung
aktualisieren sich dadurch von selbst.

Ohne gültige `downloadUrl` (muss mit `https://` oder `/downloads/` beginnen) bleibt jeder
Download-Button deaktiviert und zeigt "Coming soon" bzw. "Download unavailable".

## Auf Vercel veröffentlichen

### Variante A: über GitHub (empfohlen, Updates automatisch)

1. Auf github.com ein neues Repository anlegen (z. B. `jarvis-website`).
2. Den Inhalt dieses Ordners hochladen (Button "uploading an existing file" oder per Git).
   `index.html` muss direkt im Hauptverzeichnis des Repositories liegen.
3. Auf vercel.com mit GitHub anmelden, "Add New… → Project" wählen und das Repository importieren.
4. Einstellungen so lassen: Framework Preset = "Other", Build Command leer, Output Directory leer.
5. "Deploy" klicken. Nach kurzer Zeit ist die Seite unter `projektname.vercel.app` erreichbar.
6. Jede Änderung an `js/data.js` (neues Release) im Repository wird automatisch neu veröffentlicht.

### Variante B: per Vercel CLI

```
npm i -g vercel
cd jarvis
vercel          # Vorschau-Deployment, Fragen mit Enter bestätigen
vercel --prod   # Produktiv-Deployment
```

### Eigene Domain

Vercel → Projekt → Settings → Domains → Domain eintragen und die angezeigten DNS-Einträge beim Domain-Anbieter setzen.

## Installationsdateien hosten

- Kleine Dateien: in den Ordner `downloads/` legen, URL z. B. `/downloads/jarvis-1.2.zip`.
- Große Installer (mehrere 10 MB): besser als GitHub Release oder in Vercel Blob hosten und die `https://`-URL eintragen.
- Immer eine Prüfsumme in `checksum` eintragen, damit Nutzer die Datei verifizieren können.
- Keine API-Schlüssel oder Zugangsdaten ins Frontend schreiben.
