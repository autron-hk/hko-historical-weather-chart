# HK Monthly Temperature Range Table Generator
This is a tool to extract the monthly minimum & maximum temperature from [Hong Kong Observatory Daily Weather Summary](http://www.hko.gov.hk/wxinfo/dailywx/dailywx.shtml)


# Usage
1. Installing [node.js and npm](https://docs.npmjs.com/getting-started/installing-node)
2. Install all the dependency: `npm install`
3. Enjoy the tool: `node index.js [start_YYYY] [end_YYYY] [month_MM]`
e.g. `node index.js 2010 2017 07`

Example Output:

    .------------------------------.
    |      Temperature range       |
    |------------------------------|
    | YYYYMM | Min Temp | Max Temp |
    |--------|----------|----------|
    | 200007 | 22.7     | 35.2     |
    | 200107 | 21.3     | 35.4     |
    | 200207 | 23.0     | 35.9     |
    | 200307 | 22.9     | 35.9     |
    | 200407 | 21.2     | 37.7     |
    | 200507 | 22.7     | 37.4     |
    | 200607 | 22.9     | 36.5     |
    | 200707 | 23.5     | 35.7     |
    | 200807 | 22.1     | 36.9     |
    | 200907 | 21.8     | 37.0     |
    | 201007 | 22.6     | 36.1     |
    | 201107 | 23.5     | 36.0     |
    | 201207 | 23.0     | 37.1     |
    | 201307 | 23.2     | 35.3     |
    | 201407 | 23.7     | 36.3     |
    | 201507 | 22.2     | 36.5     |
    | 201607 | 23.3     | 37.9     |
    | 201707 | 23.4     | 37.7     |
    '------------------------------'


# Notes
  - HKO only provide historical data since 2000-01-01

