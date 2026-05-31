<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Str;

class ProductImageController extends Controller
{
    public function show(Request $request, string $slug): Response
    {
        $label = (string) $request->query('label', Str::headline(str_replace('-', ' ', $slug)));
        $type = (string) $request->query('type', 'produce');
        $style = $this->styleFor($type);

        $safeLabel = e(Str::limit($label, 46, ''));
        $safeCategory = e($style['title']);

        $svg = <<<SVG
<svg xmlns="http://www.w3.org/2000/svg" width="480" height="360" viewBox="0 0 480 360">
  <rect width="480" height="360" rx="30" fill="{$style['bg']}"/>
  <circle cx="95" cy="86" r="48" fill="{$style['accent']}" opacity="0.18"/>
  <circle cx="389" cy="282" r="78" fill="{$style['accent']}" opacity="0.12"/>
  {$style['shape']}
  <rect x="42" y="245" width="396" height="72" rx="18" fill="#ffffff" opacity="0.9"/>
  <text x="240" y="276" text-anchor="middle" font-family="Arial, sans-serif" font-size="23" font-weight="700" fill="#102a24">{$safeLabel}</text>
  <text x="240" y="303" text-anchor="middle" font-family="Arial, sans-serif" font-size="14" font-weight="700" fill="{$style['accent']}">{$safeCategory}</text>
</svg>
SVG;

        return response($svg, 200)
            ->header('Content-Type', 'image/svg+xml')
            ->header('Cache-Control', 'public, max-age=604800');
    }

    private function styleFor(string $type): array
    {
        return match ($type) {
            'meat' => [
                'title' => 'Thịt, Cá, Hải sản',
                'bg' => '#fff1f2',
                'accent' => '#e11d48',
                'shape' => '<path d="M150 155c20-55 96-76 149-43 53 34 57 101 7 137-58 41-152 26-178-28-10-21-5-43 22-66Z" fill="#fb7185"/><circle cx="303" cy="133" r="20" fill="#ffffff" opacity="0.75"/><path d="M173 197c44 29 97 34 151 3" stroke="#be123c" stroke-width="13" stroke-linecap="round" opacity="0.55"/>',
            ],
            'milk' => [
                'title' => 'Sữa, đồ uống',
                'bg' => '#eff6ff',
                'accent' => '#2563eb',
                'shape' => '<path d="M178 78h124l28 52v118H150V130l28-52Z" fill="#93c5fd"/><path d="M178 78h124l-28 52h-68l-28-52Z" fill="#dbeafe"/><rect x="176" y="153" width="128" height="58" rx="14" fill="#ffffff" opacity="0.9"/><text x="240" y="190" text-anchor="middle" font-family="Arial" font-size="25" font-weight="800" fill="#2563eb">MILK</text>',
            ],
            'cleaning' => [
                'title' => 'Hóa phẩm, tẩy rửa',
                'bg' => '#ecfeff',
                'accent' => '#0891b2',
                'shape' => '<path d="M218 76h68l16 34v130c0 23-19 41-42 41h-84c-23 0-42-18-42-41V110l84-34Z" fill="#67e8f9"/><rect x="166" y="150" width="108" height="64" rx="14" fill="#ffffff" opacity="0.9"/><path d="M289 88l49 18-9 24-42-14 2-28Z" fill="#22d3ee"/>',
            ],
            'personal' => [
                'title' => 'Chăm sóc cá nhân',
                'bg' => '#f5f3ff',
                'accent' => '#7c3aed',
                'shape' => '<rect x="180" y="88" width="120" height="184" rx="32" fill="#a78bfa"/><rect x="205" y="60" width="70" height="42" rx="12" fill="#7c3aed"/><rect x="200" y="153" width="80" height="64" rx="16" fill="#ffffff" opacity="0.9"/><circle cx="240" cy="185" r="18" fill="#ddd6fe"/>',
            ],
            'snack' => [
                'title' => 'Bánh kẹo, đồ ăn vặt',
                'bg' => '#fff7ed',
                'accent' => '#ea580c',
                'shape' => '<path d="M146 103h188l-20 166H166L146 103Z" fill="#fdba74"/><path d="M168 124h144l-11 86H179l-11-86Z" fill="#ffffff" opacity="0.85"/><circle cx="216" cy="170" r="21" fill="#fb923c"/><circle cx="262" cy="170" r="21" fill="#fb923c"/>',
            ],
            default => [
                'title' => 'Rau củ quả',
                'bg' => '#f0fdf4',
                'accent' => '#00875a',
                'shape' => '<circle cx="236" cy="170" r="72" fill="#34d399"/><path d="M246 91c-39 2-68 24-84 66 45 4 78-15 99-56" fill="#16a34a"/><path d="M252 97c41 4 67 29 78 72-43-2-73-24-91-65" fill="#22c55e"/><circle cx="221" cy="164" r="20" fill="#bbf7d0" opacity="0.75"/>',
            ],
        };
    }
}
