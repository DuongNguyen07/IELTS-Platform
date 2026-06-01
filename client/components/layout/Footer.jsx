Slide 1 — Title (10 sec)

"Hi, I'm [your name], and this is my Task 2 presentation for DMV302 Assessment 3 — a creative visualisation of historical weather data covering one full financial year with 363 daily records."


Slide 2 — The Dashboard (20 sec)

"This is my visualisation — a single four-panel dashboard in Python. I chose one coordinated figure so the viewer can compare temperature, rainfall, and anomalies all at once without switching between separate charts."


Slide 3 — Why These Diagrams? (1 min 20 sec)

"For the temperature ribbon — the dataset has actual and historical min, max, and average temperatures, so a shaded band chart is ideal to show daily variability and compare against historical norms in one view.


For the rainfall bars — rainfall is sparse and bursty, so bars naturally show zero days as empty space with spikes for heavy events. Red markers flag record rainfall days instantly.


For the anomaly heatmap — instead of showing raw temperatures again, I computed the difference from the historical average and mapped it onto a calendar grid. This reveals weekly patterns across the year that a line chart simply can't show.


For the monthly box plots — box plots show the full distribution per month, not just averages, so we can see spread, outliers, and how each month compares to historical norms side by side."


Slides 4, 5, 6 — Insights (2 min)

"From the temperature ribbon, the city has a clear four-season cycle — summer highs near 80°F, winter lows near zero. The actual line tracks close to the historical average, so this was a fairly typical year, though winter months show much wider daily variability.


Looking at the rainfall chart more closely — the city follows a clear dry-winter, wetter-summer pattern. From January through March there is almost no rainfall at all, with bars barely reaching above zero on most days. In contrast, September and June are noticeably wetter months with several moderate rainfall events. There were two standout extreme rainfall days — one in early August reaching around 1.6 inches, and one in December reaching nearly 1.9 inches — both highlighted in red, where the actual rainfall came close to or exceeded the all-time daily record for that date. The dashed orange historical average line stays consistently low at around 0.15 inches per day throughout the year, which puts those two extreme events into perspective — they were roughly ten times the daily average.


Moving to the anomaly heatmap — the colour scale here ranges from deep blue, meaning much colder than historical average, to deep red, meaning much warmer. Looking at weeks 8 to 10, which correspond to early August, we can see a strong red patch — a brief but significant warm anomaly, consistent with the record rainfall event we just saw in the rainfall chart. From weeks 20 to 26, covering December through January, there is a dominant blue region across almost all days of the week, confirming an unusually cold mid-winter compared to over a hundred years of historical data. The spring period around weeks 38 to 42 shows a very mixed pattern of alternating warm and cold patches, which explains the high variability we observed in the temperature ribbon during March and April.


From the monthly box plots — July and August show very tight red historical average boxes, meaning those months are historically very stable and predictable. However the blue actual boxes for those months are noticeably taller, meaning this year's summer was more variable than the historical norm suggests. January and February show actual medians sitting below the historical averages, confirming the colder-than-normal winter, while April and May exceeded historical norms — pointing to an early arrival of spring warmth this year."


Slide 7 — Reflection (30 sec)

"The main challenges were deciding which columns to combine without creating clutter, reshaping 363 days into the calendar heatmap grid correctly, and tuning colour scales and layout across multiple iterations to balance information density without overwhelming the viewer."


Slide 8 — Conclusion (10 sec)

"Overall, the four-panel dashboard captures temperature, rainfall, anomalies, and seasonal patterns in one readable figure. Thank you."