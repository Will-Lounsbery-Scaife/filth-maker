# filth-maker

Previously, the assistant director of Nature Camp had to spend many hours creating the duty sheet, or "filth roster," by hand. Creating the filth roster took several hours, and often contained various errors that had to be corrected later. This program will create the filth automatically, hopefully saving the assistant director many hours of work. As of 01/18/20, the program is about 80% complete.

This program is written in HTML and javascript, and it is my first ever Javascript/HTML program. As time goes on and I learn more about HTML and JS, I hope to tweek and improve the program.

The user enters the names of staff members, and then enters their days off. The program uses this info to generate a table (a "filth roster") with all duties for each day filled out.

Here is an example of an old filth roster (created without this program), to give an idea of what the final product of this program will look like.
![](Images/filthImage.png)

Things to note:
-Extra kitchens (once everyone has two kitchen) are random; the program does not favor giving an extra kitchen to people who have it on non-full days. Might be worth it for the AD to fix this manually after running the program.
-Kitchen is the only duty that is tracked to make sure people don't get it many times
-If you want a staff member to be a cook for a certain day, just add them to the DOP that day and they won't be dutied

To run this code:
-Open a web browser (I chrome and all testing and troubleshooting was done on Chrome)
-File --> Open file --> click on name_entry.html (wherever it is stored on your computer)