import tkinter as tk
from tkinter import filedialog, messagebox
import pandas as pd

def process_file():
    file_path = filedialog.askopenfilename(filetypes=[("Excel files", "*.xlsx")])
    if file_path:
        try:
            df = pd.read_excel(file_path)

            # Rename columns if exists
            if '题型' in df.columns:
                df = df.rename(columns={'题型': 'question_type'})
            if '题目描述' in df.columns:
                df = df.rename(columns={'题目描述': 'description'})
            if '参考答案' in df.columns:
                df = df.rename(columns={'参考答案': 'answer'})

            # Remove some columns if exists
            if '难度' in df.columns:
                df = df.drop(columns=['难度'])
            if '分数' in df.columns:
                df = df.drop(columns=['分数'])
            if '答案解析' in df.columns:
                df = df.drop(columns=['答案解析'])
            if '是否子题（y为子题）' in df.columns:
                df = df.drop(columns=['是否子题（y为子题）'])

            # Convert to json
            json_data = df.to_json(orient='records', force_ascii=False)

            with open('answer_utf8.json', 'w', encoding='utf-8') as file:
                file.write(json_data)

            messagebox.showinfo("成功", "数据已转换为 answer_utf8.json")
        except Exception as e:
            messagebox.showerror("错误", str(e))

app = tk.Tk()
app.title("Excel to JSON Converter")

run_button = tk.Button(app, text="选择Excel文件并转换", command=process_file)
run_button.pack(pady=20)

app.mainloop()
