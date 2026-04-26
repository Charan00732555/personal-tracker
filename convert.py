import pandas as pd
import json

df = pd.read_excel('d:/PersonalTracker/leetcode_patterns_150_dashboard.xlsx', sheet_name='Data_All')
# print columns to see what we have
print("Columns:", df.columns.tolist())
df = df.dropna(how='all')
records = df.to_dict(orient='records')
with open('d:/PersonalTracker/dsa_problems_all.json', 'w') as f:
    json.dump(records, f, indent=2)
print("Saved %d problems" % len(records))
