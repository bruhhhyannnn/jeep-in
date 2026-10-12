# JEEP-IN: A TRACKING SYSTEM FOR MODERN JEEPNEYS IN ILOCOS NORTE

**Capstone Project**  
_In partial fulfillment of the requirements for the degree of Bachelor of Science in Information Technology._

## Project Description

**JEEP-IN** is a mobile-based real-time tracking system built to modernize public transportation in Ilocos Norte by leveraging GPS. This system improves visibility, route clarity, and commuter convenience by allowing passengers to track jeepneys, view stop points, and access relevant route data.

The app supports 2 roles: **Commuter** and **Driver**, each with tailored dashboards and features.

## Developer

- Bryan Jesus B. Mangapit

## Core Features

### Commuter Features

- Live jeepneys for the direction you pick, sorted by minutes to your stop
- Nearest stop from your location, or a stop you choose when location is off
- Stop search by name, address or landmark, with stop details
- Fare for your trip from the posted LTFRB matrix, with the student / senior discount
- "Notify me at 3 min" arrival alerts, kept on the phone only
- Last known positions and offline fares when there is no signal
- Light, dark or match-phone appearance and three text sizes

### Driver Features

- One switch to share location, confirmed only once commuters can actually see it
- Sharing follows the shift hours and stops by itself at the end, with optional extra time
- Direction switch, with a prompt at the end of the route
- Report a problem to the manager in one tap
- Direction and Report lock while the jeep is moving

## Tech Stack

- **Frontend:** React Native + Expo
- **Authentication:** Firebase Authentication
- **Database:** Firebase Firestore
- **Location & Maps:** Mapbox SDK
- **State Management:** Zustand, Tanstack Query, Expo Secure Store
- **Navigation:** Expo Router

## Architectural Highlights

- Clean role-based layouts via folder routing
- Firebase modular SDK for scalable backend logic
- Design tokens shared between Tailwind (CSS variables) and JS, switching with the Appearance setting
- Arrival times measured along the route path, so no Directions API call per jeep

## Firestore Data Model

Older documents still load: missing fields fall back to defaults, and `stop_points.routeDirection` and string `routes.directions` are read as before.

| Collection         | Fields                                                                                                                                                                                                                                 |
| ------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `routes`           | `name`, `vehicleClass`, `isActive`, `workingHours { start, end }` ("HH:mm"), `averageSpeedKph`, `directions[] { id, label, via[], path[] { lat, lng } }`. Without `path`, the road is traced through the stops with Mapbox Directions. |
| `stop_points`      | `name`, `address`, `landmark`, `description`, `amenities[]`, `photoUrl`, `routeId`, `directionId`, `order`, `distanceKm` (from the first stop, for fares), `lat`, `long`, `isActive`                                                   |
| `fare_matrices`    | `routeId`, `vehicleClass`, `orderNo`, `issuedBy`, `effectiveDate`, `baseFare`, `baseKm`, `perKm`, `discountRate`, `roundTo`. Without a document, placeholder rates are shown and labelled as such.                                     |
| `jeepneys`         | `plateNumber`, `jeepneyNumber`, `routeId`, `assignedDriverId`, `status`, `seats`                                                                                                                                                       |
| `drivers`          | `name`, `employeeId`, `role` (`main` / `reliever`), `phone`, `licenseNo`, `licenseExpiry`, `photoUrl`                                                                                                                                  |
| `driver_locations` | `driverId`, `lat`, `long`, `heading`, `speed`, `directionId`, `isSharing`, `updatedAt` (server time), `overtimeUntil`                                                                                                                  |
| `driver_reports`   | `driverId`, `jeepneyId`, `unit`, `reason`, `note`, `lat`, `long`, `directionId`, `status` (`sent` / `withdrawn`), `createdAt`                                                                                                          |

## Setup & Installation

### Clone the Repository

```bash
git clone https://github.com/bruhhhyannnn/JEEP-IN.git
cd JEEP-IN
```

### **Install Dependencies**

```bash
npm install
```

### **Start the App**

```bash
npx expo start
```

## Notes

- Ensure your .env file is properly configured with your Firebase and Mapbox credentials.
- Mapbox API is used for custom map rendering and routing.
- Future updates will include background location tracking for drivers, admin data analytics, and trip history features.

---

Crafted with care by:

- Abijah Mcguiller B. Barruga
- Bryan Jesus B. Mangapit
- Mark Neilsen B. Paguirigan

MMSU | Bachelor of Science in Information Technology

---

## C4 Model Diagram

##### System Context Diagram

```mermaid
---
title: JEEP-IN | Entity Relationship Diagram
config:
  theme: default
  look: handDrawn
---
graph TB
   JEEPIN[JEEP-IN System<br/>Jeepney tracking and <br/> monitoring system.]

   Commuter[Commuter<br/>Actor.]
   Driver[Driver<br/>Actor.]
   Admin[System Owner <br/> / Administrator<br/>Actor.]

   subgraph "External Systems"
      Firebase[Firebase<br/>Backend and data services.]
      Mapbox[Mapbox<br/>Mapping and navigation <br/> services.]
      Sentry[Sentry<br/>Monitoring and crash <br/> reporting.]
   end

   Commuter -- "tracks jeepneys, stops, and routes" --> JEEPIN
   Driver -- "shares location using the mobile app" --> JEEPIN
   Admin -- "manages data & settings" --> JEEPIN

   JEEPIN -- "reads and stores data" --> Firebase
   JEEPIN -- "requests maps and routes" --> Mapbox
   JEEPIN -- "sends error and crash reports" --> Sentry
```

##### Container Diagram

```mermaid
graph TB
   subgraph JeepIN[JEEP-IN System]
      Mobile[Mobile App<br/>Android app for commuters and drivers.]
      AdminApp[Admin Web App<br/>Web app for management.]
      Backend[Firebase Backend<br/>Auth, database, storage, analytics, cloud functions.]
   end

   Commuter[Commuter<br/>Actor.]
   Driver[Driver<br/>Actor.]
   Admin[System Owner / Administrator<br/>Actor.]

   Mapbox[Mapbox<br/>Maps and routing API.]
   Sentry[Sentry<br/>Error and crash monitoring.]

   Commuter -- "tracks jeepneys and stops" --> Mobile
   Driver -- "shares real-time location" --> Mobile
   Admin -- "manages data and settings" --> AdminApp

   Mobile -- "reads and updates Jeep-IN data" --> Backend
   AdminApp -- "reads, updates, and configures data" --> Backend

   Mobile -- "requests maps and routes" --> Mapbox
   AdminApp -- "requests maps and routes" --> Mapbox

   Mobile -- "sends error and crash reports" --> Sentry
   AdminApp -- "sends error and crash reports" --> Sentry
```

##### Component Diagram

```mermaid
graph TB
   subgraph MobileApp[Mobile App]
      Nav[Navigation & Screens]
      Auth[Auth Module]
      MapTrack[Map & Tracking Module]
      Location[Location Module]
      Store[State Store Zustand]
      DataLayer[Data Layer React Query / Firestore]
      Analytics[Analytics Module]
      Errors[Error & Logging Module]
      UI[UI Components Library NativeWind]
   end

   Backend[Firebase Backend]
   Mapbox[Mapbox API]
   Sentry[Sentry]
   Smartphone[Smartphone GPS]

   %% Internal relationships
   Nav --> Auth
   Nav --> MapTrack
   Nav --> Store
   Nav --> UI

   Auth --> Backend
   Auth --> Store

   MapTrack --> Store
   MapTrack --> DataLayer
   MapTrack --> Mapbox
   MapTrack --> Location

   Location --> Smartphone
   Location --> Store
   Location --> Backend

   DataLayer --> Backend
   Analytics --> Backend
   Errors --> Sentry
```

---

## UML Use-Case Diagram

```mermaid
---
title: JEEP-IN | UML Use-Case Diagram
config:
  theme: default
  look: handDrawn
---

```

---

## Entity Relationship Diagram

```mermaid
---
title: JEEP-IN | Entity Relationship Diagram
config:
  theme: default
  look: handDrawn
---
classDiagram
   %% ENUMS
   class UserRole {
      <<enumeration>>
      commuter
      driver
   }

   class JeepneyStatus {
      <<enumeration>>
      "On route"
      Stationed
      "Out of service"
   }

   class DriverStatus {
      <<enumeration>>
      Active
      Inactive
   }

   %% TABLES
   class User {
      <<table>>
      int id PK
      string email
      string name
      UserRole role
      string profile_image_url
      timestamp created_at
      timestamp updated_at
   }

   class DriverProfile {
      <<table>>
      int id PK
      int user_id FK
      int route_id FK
      timestamp created_at
      timestamp updated_at
   }

   class Jeepney {
      <<table>>
      int id PK
      int route_id FK
      int driver_profile_id FK
      string plate_number
      number latitude
      number longitude
      number speed
      number bearing
      string current_direction
      int last_pickup_point_id FK
      int next_pickup_point_id FK
      JeepneyStatus status
      DriverStatus driver_status
      timestamp created_at
      timestamp updated_at
   }

   class Fare {
      <<table>>
      int id PK
      string landmark
      number distance
      number regular_fare
      number discounted_fare
      int route_id FK
      timestamp created_at
      timestamp updated_at
   }

   class Route {
      <<table>>
      int id PK
      string name
      string[] route_direction
      timestamp created_at
      timestamp updated_at
   }

   class PickupPoint {
      <<table>>
      int id PK
      int route_id FK
      string name
      string landmark_name
      string address
      number latitude
      number longitude
      string image_url
      timestamp created_at
      timestamp updated_at
   }

   %% RELATIONSHIPS
   User "1" --> "0..1" DriverProfile : has
   UserRole "1" --> "0..*" User : type_of

   DriverProfile "1" --> "1" User : belongs_to
   DriverProfile "1" --> "1" Route : assigned_to

   Jeepney "1" --> "1" Route : runs_on
   Jeepney "1" --> "1" DriverProfile : driven_by
   JeepneyStatus "1" --> "0..*" Jeepney : state_of
   DriverStatus "1" --> "0..*" Jeepney : driver_state_of
   Jeepney "0..*" --> "0..1" PickupPoint : last_pickup
   Jeepney "0..*" --> "0..1" PickupPoint : next_pickup

   Route "1" --> "0..*" Fare : has
   Route "1" --> "0..*" PickupPoint : has
```
