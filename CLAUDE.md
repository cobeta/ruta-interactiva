# Ruta Interactiva — Project Notes

## Boniches Daily PIN

Formula: `((day * 37 + month * 13 + 7) % 9000) + 1000`

Where `day` = day of month (1–31), `month` = month number (1–12).

Example — April 15: `((15 * 37 + 4 * 13 + 7) % 9000) + 1000` = `((555 + 52 + 7) % 9000) + 1000` = `614 + 1000` = **1614**

To get today's PIN: multiply day by 37, add month×13, add 7, take mod 9000, add 1000.
