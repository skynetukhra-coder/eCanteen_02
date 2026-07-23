import os

def replace_in_content(content):
    # 1. Backticks
    content = content.replace("`http://localhost:5000/", "`${window.API_BASE_URL}/")
    content = content.replace("`http://localhost:5000", "`${window.API_BASE_URL}")
    
    # 2. Double quotes
    content = content.replace('"http://localhost:5000/', 'window.API_BASE_URL + "/')
    content = content.replace('"http://localhost:5000"', 'window.API_BASE_URL')
    
    # 3. Single quotes
    content = content.replace("'http://localhost:5000/", "window.API_BASE_URL + '/")
    content = content.replace("'http://localhost:5000'", "window.API_BASE_URL")
    
    return content

def main():
    src_dir = 'src'
    count = 0
    for root, dirs, files in os.walk(src_dir):
        for file in files:
            if file.endswith(('.js', '.jsx', '.ts', '.tsx')):
                filepath = os.path.join(root, file)
                with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
                    content = f.read()
                
                if 'http://localhost:5000' in content:
                    new_content = replace_in_content(content)
                    with open(filepath, 'w', encoding='utf-8') as f:
                        f.write(new_content)
                    print(f"Updated: {filepath}")
                    count += 1
    print(f"Finished. Updated {count} files.")

if __name__ == '__main__':
    main()
