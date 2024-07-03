# Airbeat One 2024 - Timetabler Grabber (TMSQR API)

just a quick script in order to grab the timetable data for Airbeat One Festival 2024 from the app.

Creates files in  `./output`:

-  `stageCal--*.csv` 
    - on file per stage (where `*` is the stage-name)
    - importable into google calendars (https://calendar.google.com/calendar/u/0/r/settings/export)
- `transformedData.csv`
    - all data for gigs + stages w/ some additional columns (for date/time)
- `transformedData.json`
    - same data as the csv, but json


No sync or whatever.

## Wording

- Gigs
    - An Artist plays a gig on a specific time (start + end) at a related stage

- Stages
    - The different stages or floors
    - each stage has an (int) ID

- Artists
    - Those who play gigs on stages
    - each artist has an (int) ID

- Days
    - festival days differ from reallife days (e.g. Friday = Fr 10:00 till Sa 06:00)



## API Call for all app content

this call return the most important data:

https://api.tmsqr.app/api/v1/festival/festivalAirbeatOne/dashboard

for more discovered api urls see /doc/tmsqr-api.md


## Usage

1) `npm install`
2) Check `./config.json` (should work with default settings)
3) run: `npm run exec`
   script will call TMSQR API an do it's thing. you can also use local data (see below)
4) find generated files in `/output`


### local data

For working with local data in `./cache/data.json` set config param `useAPICall` to false.
If you'd like to use a specific data-file, set config param `dataFile`. 



## To do

_perhaps in 2025_ ;)

- implement caching for api-data into data.json (and keep old versions in order to track changes)
- google calendar api with oauth (oauth=write, api key=readonly)
- sync data between cals <-> api (one calendar per stage)
- use data.artists also in calendar data


# Google Kalender

Allianz

https://calendar.google.com/calendar/u/0?cid=NTZmNzJkNGYxMmNiN2Q3YzZjZGY3MGYzNGFjOTQxMjI1ZTAyZTViODg4ODYxZWU2ZGExMDYzYTQ5ZTE3ZGZhOEBncm91cC5jYWxlbmRhci5nb29nbGUuY29t

Arena

https://calendar.google.com/calendar/u/0?cid=NTA3YWUxZWU4NDViN2I2OGY5MDBmNWY3NWJhZDYxNzM4ZWI2YzczYjYyNjRkYTk3ZDAyMzY2ZWE2ZWU4YWZhM0Bncm91cC5jYWxlbmRhci5nb29nbGUuY29t

Classic

https://calendar.google.com/calendar/u/0?cid=NTJkZWUwMzhiMmI0ODg5ZGI3YWE2N2IyZDIzMTU4ZjExMGU2ZmM0YmJhMmFjOThjYWZmMTMxNTcwODA4ZGIzYUBncm91cC5jYWxlbmRhci5nb29nbGUuY29t

Harder

https://calendar.google.com/calendar/u/0?cid=OTc5NjU4Mjg1ZGY4ZDIyMjNmMjVlMzMxNjEyMmQ1NTViNjNlMzk4ZmQwYTk0NzkyOWU3OWMyM2E4NWY4OTZmMUBncm91cC5jYWxlbmRhci5nb29nbGUuY29t

Main

https://calendar.google.com/calendar/u/0?cid=ZGRiOTZkMTFkYWJkYzlhNWQ5MGYzNTQ0NWRiYTRhNTAxN2MyYTBiOGQ4OGQ2NzEwYzA3MWQ4ZGY0MTc1MzIzZEBncm91cC5jYWxlbmRhci5nb29nbGUuY29t

N-Joy Checkin

https://calendar.google.com/calendar/u/0?cid=MGExOTJjODUxNDJlZmUyOTQ4NjdjOTgxMTRkZDlmMWVjMzdmMTZhNzY5MWI0ZDE4NTkzMzY1NzIzOTFjMzc5ZkBncm91cC5jYWxlbmRhci5nb29nbGUuY29t

Second

https://calendar.google.com/calendar/u/0?cid=MjIwNTI5YTBmMjI5MmI3Nzc4MjMwNjllMTI5N2IzMDRmZmIwMGY4ZGFlMThmYWZjMjg1OTgyOGRkNTM4NjVmOEBncm91cC5jYWxlbmRhci5nb29nbGUuY29t

Terminal

https://calendar.google.com/calendar/u/0?cid=OWVhNmFjY2JjOWZiNTE4ZmI4MzNkM2U3MTRhNGI2ZGQyYThhNjczNGYxNGViZGRkMjM2YmQ4ZmFhZWRkMjY5ZUBncm91cC5jYWxlbmRhci5nb29nbGUuY29t

VIP

https://calendar.google.com/calendar/u/0?cid=MjEyMDNhZWZiOGZmOTJiZWVhYzA0YTY5Y2Q4Y2VkNGU5ZWY2MmU3NDdmZGE1MmQ0YzBmYTI0ODIyNDRmYjE4YkBncm91cC5jYWxlbmRhci5nb29nbGUuY29tgh re