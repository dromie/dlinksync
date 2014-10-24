#!/ffp/bin/bash
file=/tmp/cgi_environ_`date "+%H%M%S"`
exec 2>$file
echo $0 $* >&2
set >&2
export PATH=$PATH:/ffp/bin

/ffp/home/root/HD/kutya/sync.sh fetch

