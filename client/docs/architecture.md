# ארכיטקטורת המערכת (Client)

מסמך זה נועד לתת תמונת על של המערכת, כדי שכל פעולה על הקוד תתבצע מתוך הבנה של המבנה והזרימה.

## מטרה עסקית

המערכת היא אפליקציית ניהול פיננסי אישי בעברית (RTL), שמאפשרת:
- צפייה בסיכום חודשי (הכנסות, הוצאות, יתרה).
- ניהול תנועות (יצירה, עריכה, מחיקה, סינון ומיון).
- ניתוח מגמות והוצאות לפי קטגוריה.
- ניהול הון והתחייבויות: כמה כסף יושב בכל מקום וכמה נשאר לשלם.

## סטאק וטכנולוגיות

- React 19 + TypeScript + Vite.
- MUI לעיצוב ו-Theme מרכזי.
- Zustand לניהול state גלובלי.
- React Router לניווט בין דפים.
- Recharts לגרפים.
- Framer Motion לאנימציות.
- json-server כמקור נתונים מקומי (פיתוח).

## מבנה שכבות

1. שכבת כניסה ותשתית
- src/main.tsx: אתחול האפליקציה, ThemeProvider, Router, קביעת lang=he ו-dir=rtl.

2. שכבת Shell וניווט
- src/App.tsx: הגדרת routes, חיבור layout גלובלי, modal גלובלי להוספת תנועה.
- src/components/Layout/*: מעטפת UI (Sidebar, Header, Drawer, Outlet).

3. שכבת State מרכזי
- src/store/financeStore.ts:
  - מקור אמת יחיד: transactions, categories, assets, liabilities, filters, loading.
  - פעולות תנועות: add/update/delete + filters.
  - פעולות הון והתחייבויות: add/update/delete עבור assets ו-liabilities.

4. שכבת Domain/Business Logic
- src/utils/finance.ts:
  - פורמט כספי.
  - חישובי סיכום חודשי.
  - אגרגציות לגרפים.
  - חישובי הון: סך נכסים, סך התחייבויות, הון נטו.
  - תכנון נכסים: הפקדה חודשית וצבירה/תשואה שנתית לכל נכס.
  - חישובי נזילות: זמין מיידית, זמין עד X ימים, והתפלגות לפי רמת נזילות.
  - תחזית עתידית: סימולציה חודשית לפי הכנסות, הוצאות, תשלומי התחייבויות, הפקדות לנכסים וצבירה שנתית.

5. שכבת UI דפדוף ופיצ'רים
- src/pages/*:
  - DashboardPage / TransactionsPage / MonthlyPage
  - WealthPage: ניהול כספים יושבים והתחייבויות.
  - FuturePlanningPage: תחזית יתרות חודשית עד 20 שנה קדימה.
- src/components/*: קומפוננטות תצוגה/קלט לפי תחום.

6. שכבת טיפוסים וקונפיג
- src/types/*: Transaction, Category, AssetPosition, Liability.
- src/styles/theme.ts: Theme אחיד, RTL, טיפוגרפיה וצבעים.

7. שכבת נתונים (Dev)
- API בסיסי דרך VITE_API_BASE_URL (ברירת מחדל: /api).
- בפיתוח עובדים מול public/db.json דרך json-server.
- משאבים עיקריים: transactions, categories, assets, liabilities.

## זרימת מידע מרכזית

1. בעלייה ראשונית: initialize() מושך את כל המשאבים מה-API המקומי.
2. בדפים: הקריאה ל-store מחזירה state עדכני.
3. חישובים נגזרים: useMemo + util functions.
4. פעולות CRUD: נשלחות לשרת, ואז store מתעדכן ומרנדר מחדש.

## עקרונות עבודה בקוד

- Single Source of Truth: state דומייני נשמר ב-store.
- הפרדה בין לוגיקה לתצוגה: חישובים ב-utils, UI בקומפוננטות/דפים.
- העדפה לפעולות קטנות ומקומיות.
- תאימות RTL ועברית בכל רכיב חדש.

## פרוטוקול עבודה לסוכן לפני כל שינוי

בכל פעם שמתקבל Prompt לפעולה על הקוד:

1. לקרוא קודם את המסמך הזה במלואו.
2. לזהות את השכבה הרלוונטית לשינוי (Layout / Page / Store / Utils / Types / API).
3. לעבור על הקבצים המשפיעים ישירות לפני עריכה.
4. להימנע משבירת חוזים קיימים בין שכבות.
5. לאחר שינוי מהותי: להריץ בדיקות תקינות (npm run lint, npm run build).

## מפת התמצאות מהירה

- כניסה: src/main.tsx
- ראוטינג: src/App.tsx
- מצב גלובלי: src/store/financeStore.ts
- לוגיקה עסקית: src/utils/finance.ts
- דפים: src/pages/*
- רכיבי UI: src/components/*
- תצורה ועיצוב: src/styles/theme.ts
