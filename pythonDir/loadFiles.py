from os import listdir
from os.path import isfile, join
import re
import MySQLdb

def listFile(path):
    files = [f for f in listdir(path) if isfile(join(path, f))]
    return files


def readFile():
    target = "/Users/raolonghui/Downloads"
    files = listFile(target)
    for f in files:
        if -1 != f.find("91porn"):
            with open(join(target, f)) as fh:
                lines = fh.readlines();
                storeRec(lines)
        if -1 != f.find("91img"):
            with open(join(target, f)) as fh:
                lines = fh.readlines();
                storeImg(lines)

def storeImg(img):
    global cur;
    record = ''.join(img).split(";;");
    number= re.compile("\d+")
    try:
        tid= number.findall(record[0])[1];
        text= record[1];
        imgUrls= record[2:]
        sql=STMT2.format(tid, text, ";".join(imgUrls))
        cur.execute(sql)
        conn.commit()
    except Exception, err:
        print err;

def storeRec(recArray):
    global cur
    for e in recArray:
        record = e.split(";;");
        number= re.compile("\d+")
        try:
            tid= number.search(record[1]).group();
            uid=number.search(record[3]).group();
            sql= STMT.format(tid, record[4], record[0], uid, record[2])
            cur.execute(sql)
            conn.commit()
        except Exception, err:
            print(err)

STMT= "insert into 91porn(subject_id, url, subject_name, author_id, author_name) values({0},'{1}','{2}',{3},'{4}');"
STMT2="insert into 91img(tid, content, urls) values({0}, '{1}', '{2}');"
conn = MySQLdb.connect(
    host='127.0.0.1',
    port=3306,
    user='root',
    passwd='admin1234',
    db='website',
    charset='utf8'
)
cur = conn.cursor()
readFile()
cur.close();
conn.close();