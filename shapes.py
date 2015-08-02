#!/usr/bin/python

import os
import os.path
import json


if __name__ == u'__main__':
    groups = []
    root = u'shapes'
    for d in os.listdir(root):
        d = os.path.join(root, d)
        if os.path.isdir(d):
            l = None
            lfile = os.path.join(d, 'license.txt')
            if os.path.isfile(lfile):
                with open(lfile, 'rt') as f:
                    l = f.read().decode('utf-8', 'ignore')
            group = {
                u'title': d,
                u'license': l,
                u'shapes': []
            }
            for f in os.listdir(d):
                f = os.path.join(d, f)
                _, ext = os.path.splitext(f)
                if os.path.isfile(f) and ext == u'.svg':
                    print f
                    group[u'shapes'].append(f)
            groups.append(group)
    with open(u'shapes.json', u'wt') as f:
        json.dump(groups, f)
