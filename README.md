This Chrome extension is used to find answers from text selected.

To use the extension, a .xlsx file named `answer.xlsx` is needed. In the xlsx file, the user needs to specify:

- 题目描述 (description)
- 参考答案 (answer)
- columns naming A, B, ..., G
- The corresponding column from the answer for a certain question should not be empty

To use, navigate to `chrome://extensions`, open developer mode and load the unpacked folder to it.

I'm working on making the answer online (for now, any updated answer needs to run through `converter.py` and then upload the whole file to Chrome)