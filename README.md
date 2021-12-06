# Spreadsheet

## Installation Instructions
Clone the repository, or download and extract ZIP file of repository

Run the commands:

`cd spreadsheet`

`yarn run start`

Navigate to `localhost:3000` in the browser, where the application is now running


## Using the Spreadsheet
Cell formulas can be changed by selecting the desired cell, writing a formula in the formula text box in the header, and clicking the Enter button on the UI.

Cells (and their dependencies) should be updated once the Enter button on the UI is clicked.

###Supported Formula Functions
* Mathematical Expressions
    * ex. 2 + 3(2+3) as a formula will evaluate to 17
    
* String Concatenation
    * ex. zip+zap will evaluate to zipzap

* REF(cell reference) can be used to use the value of a referenced cell
    * ex. REF(A1) retrieves the value of cell A1
    
* SUM(range) computes the sum of the cells in the range
    * ex. SUM(A1..B2) computes the sum of the cells in the range A1..B2
    
* AVG(range) computes the average of the cells in the range
    * ex. AVG(A1..B2) computes the average of the cells in the range A1..B2
    
* PROD(range) computes the product of the cells in the range
    * ex. PROD(A1..B2) computes the product of the cells in the range A1..B2
    
###Spreadsheet Functions
* Cells can be cleared with the Clear button, which will clear the cell formula
* Rows can be added above a selected row with the Add Row button
* Columns can be added above a selected column with the Add Column button
* Rows can be removed using the Remove Row button
* Columns can be removed using the Remove Column button
* Cell background color can be changed
* Spreadsheet values can be exported to Excel file (.xlsx)
