# Admin-gränssnitt – REST Restaurant

Detta är adminpanelen för **REST Restaurant**, en REST-baserad webbtjänst för att hantera restaurangens innehåll som bokningar, meny och kontaktmeddelanden. Gränssnittet är endast åtkomligt för inloggade administratörer med en giltig **JWT-token**.

---

## Inloggning

Administratörer loggar in via ett formulär där användarnamn och lösenord skickas till `POST /api/login`.  
Vid godkänd inloggning returneras en **JWT-token** som lagras i `localStorage`.

Om inloggningen misslyckas visas ett tydligt felmeddelande i gränssnittet.

---

## Tokensäkerhet

JWT-token kontrolleras vid varje sidladdning:

- Om ingen token finns, eller om den är ogiltig eller har gått ut, dirigeras användaren till `login.html`.
- Token skickas i `Authorization`-headern som Authorization: Bearer <din-token>

--- 

## Bokningshantering

Efter inloggning får administratören tillgång till en översikt av alla aktuella bokningar i databasen.

### Funktioner:

- **Visa bokningar:** Namn, e-post, antal gäster, datum, tid och tilldelat bord.
- **Redigera bokning:** Klicka på "Redigera" för att visa ett formulär direkt i listan.
- **Radera bokning:** Klicka på "Radera" för att skicka ett DELETE-anrop till API:t.

Alla förändringar skickas till REST-API:t via `fetch()` och JWT-token används för autentisering.

---

## Hantera menyn

Administratören får även tillgång till hantering av menyn efter inloggning. 

- **Visa menyn:** Admin kan se alla objekt i menyn
- **Redigera meny-objekt:** Klicka på redigera för att ändra innehållet i objektet
- **Radera objekt:** Administratör kan vid klick på radera, radera objekt ur menyn
-**Lägga till objekt:** Administratör kan även lägga till nya objekt i menyn

---

## Visa meddelanden

På startsidan laddas meddelanden som skickats via ett kontaktformulär från användare av gränssnittet till gäster.

