
export function pathToBreadcumbItems(pathName: string) {
  if (!pathName) pathName = '';
  const prevPaths = pathName.split('?')[0].split('/')
  const prevAsPaths = pathName.split('/')

  return prevPaths.map((prevPath, indexPrevPath) => {
    let label = '', url = '';
    switch (indexPrevPath) {
      case 2:
        url = `/${prevPaths[1]}/${prevPaths[2]}`
        label = 'home';
        break;
      case 3:
        url = `/${prevPaths[1]}/${prevPaths[2]}/${prevPaths[3]}`
        label = prevPath;
        break;
      case 4:
        if (prevAsPaths?.[4]?.includes('[') && prevAsPaths?.[4]?.includes(']')) {
          label = `edit ${prevPaths[3]}`;
        } else if (prevPath == 'form') {
          label = prevPaths?.[5] ? `edit ${prevPaths[3]}` : `tambah ${prevPaths[3]} baru`;
        } else if (prevPath == 'manage') {
          label = `Manage ${prevPaths[3]}`;
        }
        break;
    }
    return {
      url,
      label: label.replaceAll('-', ' ')
    }
  }).filter((prevPath) => (prevPath.label));
}