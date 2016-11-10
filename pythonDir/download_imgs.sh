#! /bin/bash
set -x 

IMG_URLS=url_list
ROOT_URL=http://91.t9j.space
TMP_URL=tmp_list

cd /var/www/wordpress/attachment/

mysql -uimg -e "select urls from website.91img limit 1\G" > $IMG_URLS

while read line
do
  line1=`echo "${line}" | grep urls`
  if [ -n "$line1" ]
  then
    head -n 10 $IMG_URLS | grep urls | awk -F":" '{print $2}' | tr " ;" "\n" | grep jpg > $TMP_URL
    while read line2 
    do
      jpg=`echo $line2 | cut -d"/" -f3`
      if [ -z "$jpg" ];then
        jpg=`echo $line2 | cut -d"/" -f2`
      fi
      if [ -n "$jpg" -a ! -f "$jpg" ];then
        wget ${ROOT_URL}/$line2
      fi
    done < $TMP_URL
    #echo $line | awk -F":" '{print $2}' | tr " ;" "\n" | xargs -I {} wget ${ROOT_URL}/{}
  fi
done < $IMG_URLS
