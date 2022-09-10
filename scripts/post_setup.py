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
    title = str(' '.join(sys.argv[4:]))

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

         # add a button to the previous post
        posts = os.listdir(posts_dir)
        sorted_posts = sorted(posts, reverse=True)
        previous_post = f"https://bsubbaraman.github.io/daily-practice/posts/{sorted_posts[1]}/{sorted_posts[1]}.html"

        env = Environment(loader= FileSystemLoader("templates"))
        template = env.get_template("post-template.html")
        content = template.render(title=title, year=year, month=month, day=day, previous_post=previous_post)

        # write out the new file
        with open(os.path.join(posts_dir, new_post_dir, new_post_html), 'w') as f:
            f.write(content)
        
        # and while we're at it, add this new page as the 'next' page of the previous page!
        with open(os.path.join(posts_dir, sorted_posts[1], f"{sorted_posts[1]}.html"), 'r') as f:
            lines = []
            for line in f.readlines():
                if "&lt;--previous" in line:
                    line += f' |<a href="https://bsubbaraman.github.io/daily-practice/posts/{new_post_dir}/{new_post_html}"> next--&gt;</a>'
                lines.append(line)

        updated_content = "".join(lines)
        with open(os.path.join(posts_dir, sorted_posts[1], f"{sorted_posts[1]}.html"), 'w') as f:
            f.write(updated_content)


        print(f"setup post for {year}.{month}.{day}: {title}")

        # update the site index 
        with open("../index.html", 'r+') as f:
            full_text = ""
            for line in f.readlines():
                full_text += line
        txt_to_find = "<!-- post index start -->"
        split_text = full_text.split(txt_to_find)
        
        new_entry = f"""
    <tr>
        <td>{new_post_dir}</td>
        <td><a href="./posts/{new_post_dir}/{new_post_html}">{title}</td>
    </tr>
"""
        updated_index = split_text[0] + txt_to_find + new_entry + split_text[1]

        with open("../index.html", 'w') as f:
            f.write(updated_index)

        
        
        
