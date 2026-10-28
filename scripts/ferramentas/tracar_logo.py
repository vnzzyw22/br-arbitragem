# RASCUNHO — ver docs/FERRAMENTAS.md (o aro ainda não é detectado; corrigir antes de usar).
# Vetoriza a logo original (150x150 JPG) por camadas de cor, sem redesenhar: cada camada é o
# contorno (potrace) da máscara tirada dos próprios pixels, ampliados 10x com suavização.
import sys, subprocess, re, os
import numpy as np
from PIL import Image, ImageFilter
from scipy import ndimage as ndi

src, out = sys.argv[1], sys.argv[2]
K = 10
im = np.array(Image.open(src).convert('RGB')).astype(float)
H, W, _ = im.shape
R, G, B = im[...,0], im[...,1], im[...,2]
L = 0.299*R + 0.587*G + 0.114*B
azul = np.clip((B - R - 15) / 60, 0, 1)            # quanto o pixel é "azul da logo"
sat = im.max(2) - im.min(2)

def up(a, sigma=0.0):
    img = Image.fromarray((np.clip(a,0,1)*255).astype('uint8')).resize((W*K, H*K), Image.BICUBIC)
    if sigma: img = img.filter(ImageFilter.GaussianBlur(sigma))
    return np.array(img).astype(float)/255

def trace(mask, name, alpha=1.0, turd=20):
    pbm = f"{out}/{name}.pbm"
    Image.fromarray(((~mask)*255).astype('uint8')).convert('1').save(pbm)
    svg = subprocess.run(['potrace', pbm, '-s', '-o', '-', '-t', str(turd), '-a', str(alpha), '-O', '0.4', '--flat'], capture_output=True, text=True, check=True).stdout
    ds = re.findall(r'<path d="([^"]+)"', svg, re.S)
    tr = re.search(r'<g transform="([^"]+)"', svg).group(1)
    return tr, ' '.join(d.replace('\n',' ') for d in ds)

camadas = []
# 1) azul (B)
mb = up(azul, 3) > 0.5
camadas.append(('#5888c8', 'azul', mb))
# 2) cinza escuro (R, ARBITRAGEM, aro): baixa saturação e escuro
cinza = np.clip((200 - L) / 60, 0, 1) * (sat < 40) * (azul < 0.2)
mc = up(cinza, 2.5) > 0.5
lab, n = ndi.label(mc)
sizes = ndi.sum(mc, lab, range(1, n+1))
# separa o aro (componente que toca a borda/maior bbox) do resto
objs = ndi.find_objects(lab)
aro = np.zeros_like(mc); letras = np.zeros_like(mc)
for i, sl in enumerate(objs):
    h = sl[0].stop - sl[0].start; w = sl[1].stop - sl[1].start
    comp = lab == i+1
    if h > 0.6*H*K or w > 0.6*W*K: aro |= comp
    else: letras |= comp
camadas.append(('#787878', 'cinza', letras))
# 3) bola fantasma em tons claros (só na região à esquerda do B)
regiao = np.zeros((H,W)); regiao[25:110, 3:45] = 1
for nivel, cor, nome in [(244, '#ececec', 'bola1'), (232, '#dadada', 'bola2'), (216, '#c4c4c4', 'bola3')]:
    m = np.clip((nivel - L)/8, 0, 1) * regiao * (azul < 0.2)
    camadas.append((cor, nome, (up(m, 3) > 0.5) & ~mb & ~letras))

# aro: ajusta um círculo aos pixels (mínimos quadrados) em vez de traçar
ys, xs = np.nonzero(aro)
A = np.c_[2*xs, 2*ys, np.ones_like(xs)]
cx, cy, c = np.linalg.lstsq(A, xs**2 + ys**2, rcond=None)[0]
r = np.sqrt(c + cx**2 + cy**2)
# espessura média do aro
d = np.hypot(xs-cx, ys-cy)
esp = (np.percentile(d, 95) - np.percentile(d, 5))
print('aro', cx/K, cy/K, r/K, 'esp', esp/K, file=sys.stderr)

partes = []
for cor, nome, m in camadas:
    tr, d = trace(m, nome)
    partes.append(f'<path fill="{cor}" d="{d}" transform="{tr}"/>')
svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 150 150">
<circle cx="{cx/K:.2f}" cy="{cy/K:.2f}" r="{r/K - esp/K/2:.2f}" fill="#f8f8f8"/>
<g transform="scale({1/K})">
{chr(10).join(partes[2:])}
{partes[0]}
{partes[1]}
</g>
<circle cx="{cx/K:.2f}" cy="{cy/K:.2f}" r="{r/K:.2f}" fill="none" stroke="#8a8a8a" stroke-width="{max(esp/K,0.6):.2f}"/>
</svg>'''
open(f'{out}/logo-tracada.svg','w').write(svg)
print(len(svg), file=sys.stderr)
