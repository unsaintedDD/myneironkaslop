import os

import json

base_dir = r"C:\own wed"
folders = {
    "page": "важное",
    "page2": "хлам"
}

pages_data = []

# HTML код нашей плавающей кнопки "На главную"
back_button_html = '<a href="../index.html" style="position:fixed; top:15px; left:15px; background:#2563eb; color:white; padding:10px 15px; text-decoration:none; border-radius:8px; font-family:sans-serif; font-weight:bold; box-shadow: 0 4px 6px rgba(0,0,0,0.3); z-index:9999;">⬅ На главную</a>'

for folder_name, category in folders.items():
    folder_path = os.path.join(base_dir, folder_name)
    if not os.path.exists(folder_path):
        os.makedirs(folder_path)

    for filename in os.listdir(folder_path):
        if not filename.endswith('.html'):
            continue

        file_path = os.path.join(folder_path, filename)
        
        # Читаем содержимое файла
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Если кнопки в файле еще нет, аккуратно вставляем ее после <body>
        if '⬅ На главную' not in content and '<body' in content.lower():
            # Находим, где заканчивается тег <body ... >
            body_start = content.lower().find('<body')
            body_end = content.find('>', body_start) + 1
            
            # Вклеиваем кнопку
            new_content = content[:body_end] + '\n' + back_button_html + '\n' + content[body_end:]
            
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(new_content)

        # Добавляем файл в базу для поиска
        title = filename.replace('.html', '').replace('-', ' ').title()
        pages_data.append({
            "title": title,
            "url": f"{folder_name}/{filename}",
            "category": category
        })

js_content = f"const pagesData = {json.dumps(pages_data, ensure_ascii=False, indent=4)};"

with open(os.path.join(base_dir, "database.js"), 'w', encoding='utf-8') as f:
    f.write(js_content)

print("База обновлена! Кнопка 'На главную' автоматически добавлена во все HTML файлы.")