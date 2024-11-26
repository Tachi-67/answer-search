import pandas as pd

df = pd.read_excel('answer.xlsx') 

# rename columns if exists

if '题型' in df.columns:
    df = df.rename(columns={
        '题型': 'question_type',
    })

if '题目描述' in df.columns:
    df = df.rename(columns={
        '题目描述': 'description',
    })

if '参考答案' in df.columns:
    df = df.rename(columns={
        '参考答案': 'answer',
    })


# remove some columns if exists
if '难度' in df.columns:
    df = df.drop(columns=['难度'])
if '分数' in df.columns:
    df = df.drop(columns=['分数'])
if '答案解析' in df.columns:
    df = df.drop(columns=['答案解析'])
if '是否子题（y为子题）' in df.columns:
    df = df.drop(columns=['是否子题（y为子题）'])


# convert to json
json_data = df.to_json(orient='records', force_ascii=False)

with open('answer_utf8.json', 'w', encoding='utf-8') as file:
    file.write(json_data)

print("Data converted to answer_utf8.json")