﻿'===========================================================
'Function to Create a Random Number with DateTime Stamp
'===========================================================
Function fnRandomNumberWithDateTimeStamp()

'Find out the current date and time
Dim sDate : sDate = Day(Now)
Dim sMonth : sMonth = Month(Now)
Dim sYear : sYear = Year(Now)
Dim sHour : sHour = Hour(Now)
Dim sMinute : sMinute = Minute(Now)
Dim sSecond : sSecond = Second(Now)

'Create Random Number
fnRandomNumberWithDateTimeStamp = Int(sDate & sMonth & sYear & sHour & sMinute & sSecond)

'======================== End Function =====================
End Function

Dim BrowserExecutable, ProposalName, ExecutiveOverview

While Browser("CreationTime:=0").Exist(0)   												'Loop to close all open browsers
	Browser("CreationTime:=0").Close 
Wend
BrowserExecutable = DataTable.Value("BrowserName") & ".exe"
SystemUtil.Run BrowserExecutable,"","","",3													'launch the browser specified in the data table
Set AppContext=Browser("CreationTime:=0")													'Set the variable for what application (in this case the browser) we are acting upon

'===========================================================================================
'BP:  Navigate to the PPM Launch Pages
'===========================================================================================

AppContext.ClearCache																		'Clear the browser cache to ensure you're getting the latest forms from the application
AppContext.Navigate DataTable.Value("URL")													'Navigate to the application URL
AppContext.Maximize																			'Maximize the application to give the best chance that the fields will be visible on the screen
AppContext.Sync																				'Wait for the browser to stop spinning
AIUtil.SetContext AppContext																'Tell the AI engine to point at the application

'===========================================================================================
'BP:  Click the Executive Overview link
'===========================================================================================
AIUtil.FindText("Strategic Portfolio").Click

'===========================================================================================
'BP:  Click the Tina Fry (Business User) link to log in as Tina Fry
'===========================================================================================
AIUtil.FindTextBlock("Tina Fry").Click
AIUtil.FindTextBlock("Requests I've Submitted").Exist

'===========================================================================================
'BP:  Click the Create menu item
'===========================================================================================
AIUtil.FindText("CREATE", micFromTop, 1).Click

'===========================================================================================
'BP:  Click the Proposal text
'===========================================================================================
AIUtil.FindTextBlock("Proposal").Click

'===========================================================================================
'BP:  Select the "Corporate" value in the Business Unit combobox
'===========================================================================================
AIUtil("combobox", """Business Unit:").Select "Corporate"

'===========================================================================================
'BP:  Type a unique proposal name into the Proposal Name field
'===========================================================================================
ProposalName = "Proposal Name " & fnRandomNumberWithDateTimeStamp
AIUtil("text_box", "'Proposal Name:").Type ProposalName

'===========================================================================================
'BP:  Enter unique text into the Executive Overview: field
'===========================================================================================
ExecutiveOverview = DataTable.Value("dtExecutiveOverview") & ProposalName
Browser("Create New PFM - Proposal").Page("Create New PFM - Proposal").WebEdit("ExecutiveOverview").Set ExecutiveOverview

'===========================================================================================
'BP:  Enter the Business Objective value
'===========================================================================================
AIUtil("text_box", "Business Objective").Type DataTable.Value("BusinessObjective")

'===========================================================================================
'BP:  Click the Submit text
'===========================================================================================
AIUtil.FindText("Submit", micFromRight, 1).Click
AIUtil.FindTextBlock("Your Request is Created").Exist
AIUtil.FindTextBlock("Status: New").Exist

'===========================================================================================
'BP:  Logout
'===========================================================================================
Browser("Create New PFM - Proposal").Page("Req #42952: Details").WebElement("menuUserIcon").Click
AIUtil.FindTextBlock("Sign Out (Tina Fry)").Click

AppContext.Close																			'Close the application at the end of your script

