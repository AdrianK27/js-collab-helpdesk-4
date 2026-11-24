1. odczyt po odświeżeniu

Oczekiwany wynik: Zgłoszenie pozostaje widoczne po odświeżeniu strony.

Otrzymany rezultat: Zgłoszenie pozostało na liście po odświeżeniu strony.

2. odmowa zapisu

Oczekiwany wynik: Aplikacja informuje o błędzie zapisu i nie dodaje zgłoszenia do listy.

Otrzymany rezultat: Aplikacja wyświetliła komunikat „Nie udało się zapisać danych!”. Zgłoszenie nie pojawiło się na liście.

3. zły JSON w storage

Oczekiwany wynik: Aplikacja wykrywa niepoprawny JSON i wyświetla komunikat o błędzie odczytu danych.

Otrzymany rezultat: Aplikacja wykryła błąd JSON, wyświetliła komunikat „Nie udało się odczytać zapisanych zgłoszeń!” i nie wyświetliła zgłoszeń.

4. import []

Oczekiwany wynik: Import pustej tablicy kończy się powodzeniem, a lista zgłoszeń zostaje wyczyszczona.

Otrzymany rezultat: Import zakończył się pomyślnie. Liczba zgłoszeń wyniosła 0, a lista została wyczyszczona.

5. duplikat

Oczekiwany wynik: Import zostaje odrzucony z powodu powtarzającego się ID zgłoszenia.

Otrzymany rezultat: Aplikacja wykryła powtarzające się ID i wyświetliła komunikat „Wykryto duplikat ID!”. Import został odrzucony.

6. zły ostatni rekord

Oczekiwany wynik: Import zostaje odrzucony z powodu niepoprawnego tytułu zgłoszenia, a poprzednia lista pozostaje bez zmian.

Otrzymany rezultat: Aplikacja wyświetliła komunikat „Tytuł musi mieć od 3 do 80 znaków!”. Import został odrzucony.

7. 404

Oczekiwany wynik: Aplikacja wykrywa brak pliku i wyświetla komunikat o błędzie HTTP 404.

Otrzymany rezultat: Aplikacja wyświetliła komunikat „Błąd HTTP: 404”.

8. HTML zamiast JSON

Oczekiwany wynik: Aplikacja wykrywa odpowiedź w niepoprawnym formacie i informuje o błędzie importu.

Otrzymany rezultat: Podczas próby odczytu HTML jako JSON wystąpił błąd „Unexpected token '<'”. Import został przerwany.

9. anulowane potwierdzenie

Oczekiwany wynik: Import zostaje anulowany, a dotychczasowa lista zgłoszeń pozostaje bez zmian.

Otrzymany rezultat: Po kliknięciu „Anuluj” aplikacja wyświetliła komunikat „Import anulowany”.

10. podwójne kliknięcie

Oczekiwany wynik: Aplikacja zabezpiecza się przed wielokrotnym uruchomieniem importu.

Otrzymany rezultat: Import zakończył się pomyślnie. Zaimportowano 3 zgłoszenia, bez powielania danych.

11. wolna sieć

Oczekiwany wynik: Podczas importowania zgłoszeń formularz i możliwość edycji są zablokowane do zakończenia importu.

Otrzymany rezultat: Podczas importowania wyświetla się komunikat „Trwa importowanie...”, a wpisywanie danych i dodawanie zgłoszeń jest zablokowane.