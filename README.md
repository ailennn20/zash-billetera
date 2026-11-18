# Zash · La billetera para Rosa

Prototipo interactivo de billetera virtual orientada a **personas mayores y jubilados**.

Estilo de demo tipo BNN (marco de celular + índice de pantallas), con la identidad y flujos de Zash.

## Características

### Para personas mayores
- Letras grandes y botones táctiles amplios (≥ 48px)
- Alto contraste: navy `#0B2A66` + ámbar `#FFC933`
- Sin anuncios ni distracciones
- Confirmación explícita antes de cada operación

### Voz
- **Síntesis de voz** (es-AR) para narrar confirmaciones y guías
- **Reconocimiento de voz** (SpeechRecognition): “¿cuánto dinero tengo?”, “pagar boletas”, “enviar plata a Marta”, etc.
- Hoja de voz con chips de ejemplo + campo de texto alternativo
- Toggle voz on/off

### Biometría
- Activación opcional de **huella / cara** (WebAuthn platform authenticator)
- Pantalla de bloqueo con biometría + fallback a PIN de 4 dígitos
- Límite de intentos de clave + bloqueo temporal
- Auto-bloqueo tras 60 s en segundo plano

### Pantallas (15)
1. Bienvenida  
2. Clave de 4 números (crear / confirmar / entrar)  
3. Ingreso con huella o cara  
4. Activar biometría  
5. Inicio (saldo + acciones + mic)  
6. Pagar boletas  
7. Enviar plata  
8. Persona nueva  
9. Escribir monto  
10. Confirmar (con “leerme en voz alta”)  
11. Comprobante  
12. Movimientos  
13. Pagos automáticos  
14. Pedir ayuda  
15. **Arquitectura** (capas, flujos, principios)

## Cómo correrlo

```bash
pnpm install   # o npm install
pnpm dev       # http://localhost:3000
```

**Notas**
- Biometría y micrófono requieren HTTPS o `localhost` y permiso del navegador.
- El reconocimiento de voz funciona mejor en Chrome.
- Todo es simulado: no hay bancos ni dinero real.

## Estructura

```
app/                  Next.js App Router
components/zash/
  demo-shell.tsx      Marco + índice
  voice-sheet.tsx     Modal de voz
  ui.tsx
  screens/            Las 15 pantallas
lib/zash/
  data.ts             Datos de ejemplo (Rosa)
  store.tsx           Estado + voz + biometría
types/speech.d.ts
public/
```
