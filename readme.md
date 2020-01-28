Jeg valgte et alt for komplekst projekt hvor jeg ville integrere direkte med lectio og derigennem tracke ændringer. Dette kræver workaround vedr. deres login gateway samt meget html parsing. Jeg har derfor skiftet retning og lavet en simpel og hurtig chat applikation.
Du kan oprette en bruger og logge ind via den, derfra kan du skrive med alle brugere på platformen. Mit front end javascript er ikke specielt kønt og skrevet hurtigt, derudover har jeg designet backend delene ud fra at projektet ikke skal udvides så rigtig mange filer og ting bør seperes mere op hvis jeg vil videreudvikle på det. Der mangler også parsing af dates, men fokuset har været sql integrationen.
Jeg har brugt et sqlite library hvor jeg har arbejdet med prepared statements, hvilket altså betyder sql injection ikke er muligt. Se evt. controllers/messages.js for at se nogle af de mere komplekse sql queries det er lavet til projektet.
Når tekst sættes ind bliver det gjort via textnodes hvilket også betyder man ikke kan lave xss / script injections derigennem, login formen gør brug af bcrypt for hashing af password.

Projektet er udviklet i node.js hvori jeg bruger express og socket io til web delen. For server rendering og layout håndtering bliver express-handlebars brugt.
For at køre det skal nodejs og npm installeres på computeren hvorefter man via en terminal kan køre projektet.
Først skal modulerne hentes ned, dette gøres via
`npm install`
hvorefter
`npm start`
kan køres og hjemmesiden kan tilgås via
`localhost:3000`
