import sys, os
INTERP = os.path.join(os.environ['HOME'], '.pyenv', 'versions',
                      'anaconda3-5.1.0','envs','liquidionviewdataenv','bin', 'python')
if sys.executable != INTERP:
    os.execl(INTERP, INTERP, *sys.argv)
from viewdataapp import app as application

