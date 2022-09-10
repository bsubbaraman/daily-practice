import os
import sys
from jinja2 import Environment, FileSystemLoader, select_autoescape


if __name__ == '__main__':
    if len(sys.argv) < 5:
        print("Usage: post_setup.py <YYYY> <MM> <DD> <post_title>")
        exit()
    
    year = int(sys.argv[1])
    month = str(sys.argv[2])
    day = str(sys.argv[3])
    title = str(sys.argv[4])

    if year < 1000:
        print("Use a 4 digit yr format")
    year = str(year)

    # 0 padding on month/day for consistency
    if len(month) < 2:
        month = "0" + month
    if len(day) < 2:
        day = "0" + day
    
    posts_dir = "../posts"
    new_post_dir = year+month+day

    if os.path.isdir(os.path.join(posts_dir, new_post_dir)):
        print("a dir for that post already exists")
        exit()
    else:
        os.makedirs(os.path.join(posts_dir, new_post_dir))
        os.makedirs(os.path.join(posts_dir, new_post_dir, 'images'))
        os.makedirs(os.path.join(posts_dir, new_post_dir, 'code'))


        new_post_html = new_post_dir + ".html"

        env = Environment(loader= FileSystemLoader("templates"))
        template = env.get_template("template.html")
        content = template.render(title=title, year=year, month=month, day=day)

        with open(os.path.join(posts_dir, new_post_dir, new_post_html), 'w') as f:
            f.write(content)

        print(f"setup post for {year}.{month}.day: {title}")
