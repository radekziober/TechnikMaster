# Koncepcja Projektu: MagazynMaster

## 1. Wprowadzenie
**MagazynMaster** to system zarządzania magazynkami (Handling Units) przeznaczony dla linii produkcyjnych SMT/THT. Aplikacja ma na celu usprawnienie nadzoru nad stanem technicznym, lokalizacją oraz konserwacją nośników, oferując dedykowane moduły dla Techników oraz Operatorów.

## 2. Architektura Informacji
System opiera się na dwóch głównych rolach użytkowników:
*   **Technik**: Pełny dostęp do zarządzania, planowania konserwacji i konfiguracji.
*   **Operator**: Uproszczony interfejs do szybkiego zgłaszania usterek.

## 3. Główne Moduły i Funkcjonalności

### 3.1. Panel Główny (Dashboard Technika)
Centrum dowodzenia dla technika, oferujące szybki wgląd w kluczowe wskaźniki (KPI).
*   **Karty KPI**:
    *   **Wszystkie magazynki**: Całkowita liczba magazynków w systemie.
    *   **Otwarte zgłoszenia**: Liczba aktywnych, nierozwiązanych zgłoszeń usterek.
    *   **Po terminie przeglądu**: Liczba magazynków, których data konserwacji minęła.
    *   **Konserwacja (30 dni)**: Liczba magazynków wymagających przeglądu w ciągu najbliższego miesiąca.
*   **Ostatnie zgłoszenia usterek**: Tabela wyświetlająca najnowsze raporty od operatorów (ID magazynka, typ usterki, zgłaszający, data, status).

### 3.2. Zarządzanie Magazynkami (Magazynki)
Kompleksowa lista i narzędzia do obsługi cyklu życia magazynka.
*   **Widok Listy**: Tabela z możliwością filtrowania i wyszukiwania (po nazwie lub lokalizacji). Kolumny zawierają: Status, Nazwę, Grupę Projektową, Lokalizację, Termin Konserwacji oraz Akcje.
*   **Filtrowanie**: Możliwość filtracji listy po konkretnej Grupie Projektowej.
*   **Dodawanie/Edycja Magazynka**: Formularz pozwalający na definicję parametrów:
    *   Nazwa (kod, np. $1234)
    *   Status (OK, USZKODZONY, W_KONSERWACJI, WYCOFANY)
    *   Grupa Projektowa
    *   Lokalizacja (MES)
    *   Daty: Ostatnia konserwacja, Następna konserwacja, Data produkcji
    *   Cykl konserwacji (w miesiącach)
*   **Planowanie Konserwacji**: Szybka akcja do ustawienia nowej daty przeglądu (typ PREVENTIVE).
*   **Obsługa Napraw (Serwis)**: Proces naprawczy dla uszkodzonych magazynków:
    *   Wprowadzenie opisu naprawy.
    *   Automatyczna zmiana statusu na **OK**.
    *   Automatyczne zamknięcie powiązanych zgłoszeń usterek.
    *   Dodanie wpisu do historii (typ CORRECTIVE).
*   **Szczegóły Magazynka**: Modal wyświetlający pełną historię konserwacji i zgłoszonych usterek.
*   **Kody DataMatrix**: Generowanie podglądu kodu QR/DataMatrix dla danego magazynka (do druku etykiet).

### 3.3. Grupy Projektowe
Konfiguracja typów projektów obsługiwanych na produkcji.
*   **Zarządzanie Grupami**: Tworzenie, edycja i usuwanie grup projektowych.
*   **Atrybuty Grupy**:
    *   Nazwa (np. VW Golf 8)
    *   Typ Projektu (VW, AUDI, BMW, FLP, OTHER)
    *   Rodzaj Magazynka (CAB mały/duży, ULC)
    *   Szerokość PCB (mm)
    *   Kolor (oznaczenie wizualne w systemie)
    *   Opis

### 3.4. Tryb Operatora (Operator View)
Uproszczony, "kioskowy" interfejs dla pracowników produkcji, zoptymalizowany pod ekrany dotykowe.
*   **Proces Zgłaszania Usterki**:
    1.  **Skanowanie**: Wprowadzenie kodu magazynka (ręcznie lub skanerem).
    2.  **Weryfikacja i Wybór Usterki**: Potwierdzenie znalezionego magazynka i wybór typu defektu z listy (np. "Krzywy magazynek", "Uszkodzona podstawa"). Możliwość dodania opisu tekstowego.
    3.  **Potwierdzenie**: Ekran sukcesu po wysłaniu zgłoszenia.
*   **Automatyzacja**: Zgłoszenie usterki automatycznie zmienia status magazynka na **USZKODZONY** (DAMAGED) w systemie głównym.

## 4. Model Danych (Types)
System operuje na następujących kluczowych encjach:
*   **ProjectGroup**: Definicja rodziny produktów.
*   **Magazine**: Fizyczny nośnik, przypisany do grupy, posiadający swój cykl życia i status.
*   **DefectReport**: Zgłoszenie problemu przez operatora.
*   **MaintenanceLog**: Wpis w historii serwisowej (przegląd lub naprawa).

## 5. Technologie
*   **Frontend**: React (TypeScript), Vite
*   **Stylowanie**: Tailwind CSS
*   **Ikony**: Lucide React
*   **Stan Aplikacji**: Lokalny stan React (symulacja bazy danych w pamięci na potrzeby prototypu/MVP).

## 6. Przyszły Rozwój (Opcjonalnie)
*   Integracja z fizycznymi skanerami kodów kreskowych (HID).
*   Backendowa baza danych (np. PostgreSQL/Supabase) dla trwałości danych.
*   Integracja z systemem MES do automatycznego pobierania lokalizacji.
*   Powiadomienia email/SMS dla techników o nowych usterkach.
