# Real-Life Nature Archive App — MVP Implementation Plan

## 1. Doel van dit document
Dit document beschrijft **exact en volledig** wat de MVP van de *Real‑Life Nature Archive App* moet bevatten.

Het doel is dat **een externe ontwikkelaar of team** dit document kan gebruiken om de MVP te bouwen **zonder extra uitleg of interpretatie**.

De app is geïnspireerd op het verzamel‑ en ontdekkingsgevoel van een Pokédex, maar gebruikt **neutrale terminologie** (collectie / archief) en richt zich op **echte natuurverkenning**.

---

## 2. MVP-definitie (wanneer is het af?)
De MVP is succesvol wanneer een nieuwe gebruiker:

1. Een account kan aanmaken en inloggen
2. Een korte onboarding krijgt (alleen de eerste keer)
3. Vanuit de home een **foto kan maken met de camera**
4. Deze foto automatisch laat analyseren
5. Een **top 3 aan herkenningssuggesties** krijgt
6. Eén suggestie bevestigt (of opnieuw een foto maakt)
7. Een **informatiepagina van de ontdekking** ziet
8. De ontdekking opslaat
9. Deze terugziet in een **persoonlijke collectie / archief**

Alles buiten deze flow valt **buiten de MVP**.

---

## 3. Technische stack (vast)

### Frontend
- React Native
- Expo framework

### Backend / infrastructuur
- Firebase
  - Firebase Authentication (email + wachtwoord)
  - Firestore (database)
  - Firebase Storage (foto-opslag)
  - Firebase Cloud Functions (analyse & serverlogica)

### AI / herkenning
- Externe herkenningsservice (plant / dier / insect)
- Integratie **uitsluitend via Cloud Functions** (niet direct vanuit de app)

---

## 4. Scope-afbakening

### In scope (MVP)
- Camera-only foto’s (geen galerij)
- Persoonlijke, privé collectie
- Basis privacy-instellingen
- Handmatige bevestiging van herkenning

### Expliciet niet in scope
- Uploaden vanuit galerij
- Social features (likes, feed, volgen)
- Kaarten of heatmaps
- Achievements, levels of streaks
- Offline gebruik
- Zelf ML-modellen trainen

---

## 5. Schermen & functionaliteit (exacte specificatie)

### 5.1 Account & onboarding

#### Account
- Gebruiker kan een account aanmaken met e-mail en wachtwoord
- Gebruiker kan inloggen en uitloggen
- Alle data is gekoppeld aan het account

#### Onboarding (alleen bij eerste login)
- Bestaat uit 2–3 schermen
- Legt uit:
  1. Dat je buiten een foto maakt van een dier/plant/insect
  2. Dat de app de foto analyseert
  3. Dat er een informatiepagina van de ontdekking wordt aangemaakt
- Na afronden wordt `onboardingCompleted = true` opgeslagen

---

### 5.2 Home / Dashboard

#### Home bevat:
- Lijst met **recente ontdekkingen** (laatste waarnemingen)
- Grote knop: **Nieuwe scan**
- Statistieken:
  - Aantal soorten ontdekt
  - Aantal waarnemingen
- Knop/link naar:
  - **Mijn collectie / archief**
- Knop naar:
  - **Instellingen**

#### Navigatie
- Klik op recente ontdekking → opent detailpagina
- Sluiten detailpagina → terug naar home

---

### 5.3 Foto maken & uploaden

#### Camera
- Alleen camera toegestaan (geen galerij)
- Camera-permissie wordt gevraagd bij eerste gebruik
- Na maken van foto:
  - Preview tonen
  - Acties: **Gebruik foto** / **Opnieuw**

#### Upload & analyse
- Foto wordt geüpload naar Firebase Storage
- Observation-document wordt aangemaakt in Firestore
- Status wordt gezet op `uploaded` → `analyzing`
- Cloud Function start analyse

---

### 5.4 Analyse & herkenningsresultaat

#### Analyse
- Cloud Function:
  - Haalt foto uit Storage
  - Stuurt deze naar herkenningsservice
  - Ontvangt top 3 suggesties
  - Slaat deze op in `observations.suggestions`
  - Zet status op `ready_for_review`

#### Resultaatscherm
- Toont top 3 suggesties
- Suggestie #1 is visueel groter (hoogste confidence)
- Elke suggestie bevat:
  - Naam
  - Confidence score
  - Referentiefoto

#### Acties gebruiker
- Bevestig één van de suggesties
- Of: **Nieuwe foto maken** (verwijdert huidige observation)

---

### 5.5 Ontdekking – detailpagina

#### Bovenste sectie
- Gebruikersfoto (hero image)
- Naam in app-taal (meertalig ondersteund)
- Latijnse naam
- Categorie-badge (plant / insect / dier)
- Label **Nieuw** als dit de eerste keer is dat deze soort door de gebruiker is ontdekt

#### Locatie (optioneel)
- Gebruiker kan een globale locatie toevoegen
- Max detail: plaatsnaam / regio
- Exacte GPS-coördinaten zijn niet vereist

#### Informatie-secties
- Beschrijving
- Herkenningspunten (bullet list)
- Habitat
- Seizoen / wanneer te zien

#### Acties
- Opslaan
- Verwijderen

Na opslaan of verwijderen → navigatie naar **collectie / archief**

---

### 5.6 Collectie / Archief

#### Overzicht
- Grid view met thumbnails
- Per item:
  - Foto
  - Naam
  - Categorie-icoon

#### Functionaliteit
- Filteren op categorie
- Zoeken op naam (tekst)
- Sorteren:
  - Nieuwste eerst
  - Oudste eerst

Klik op item → opent detailpagina

---

### 5.7 Instellingen

- App-versie zichtbaar
- Uitloggen
- Privacy-instellingen:
  - Locatie opslaan aan/uit (default: uit)
- Account verwijderen (aanvraag):
  - Extra bevestigingsstap
  - Niet direct uitvoerend (veiligheid)

---

## 6. Datamodel (Firestore)

### users/{uid}
```json
{
  "email": "user@example.com",
  "createdAt": "timestamp",
  "onboardingCompleted": true,
  "settings": {
    "locationEnabled": false,
    "language": "nl"
  },
  "stats": {
    "observationsCount": 0,
    "speciesDiscoveredCount": 0
  }
}
```

### observations/{observationId}
```json
{
  "uid": "USER_UID",
  "status": "uploaded | analyzing | ready_for_review | confirmed | saved | deleted | failed",
  "createdAt": "timestamp",
  "image": {
    "storagePath": "users/uid/observations/id.jpg",
    "downloadUrl": "https://..."
  },
  "suggestions": [],
  "confirmed": {
    "speciesId": "string",
    "confidence": 0.82,
    "isNewForUser": true
  },
  "location": {
    "enabled": false,
    "label": "Apeldoorn"
  }
}
```

### species/{speciesId}
```json
{
  "name": { "nl": "…", "en": "…" },
  "latinName": "…",
  "category": "plant | insect | animal",
  "info": {
    "description": { "nl": "…" },
    "identificationPoints": { "nl": [] },
    "habitat": { "nl": "…" },
    "seasonality": { "nl": "…" }
  }
}
```

---

## 7. Kwaliteitseisen
- App mag geen crashes vertonen bij mislukte herkenning
- Herkenning mag onzeker zijn, gebruiker heeft altijd controle
- Privacy is default veilig (geen locatie, geen sharing)
- Alle flows moeten mobiel intuïtief zijn

---

## 8. Conclusie
Dit document beschrijft **volledig en ondubbelzinnig** de MVP van de Real‑Life Nature Archive App.

Elke functionaliteit buiten dit document valt **buiten scope** en mag pas na MVP-validatie worden toegevoegd.

