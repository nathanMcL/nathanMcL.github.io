# (09/19/2025.0427) Sketchy

Inspired by the `Etch-A-Sketch`, I want to build my own custom version. Design a `508`-friendly, responsive design, keyboard-driven Etch-a-Sketch-inspired app.  

## History of the Etch-A-Sketch

![EtchaSkect_tajihall](https://github.com/user-attachments/assets/6dd79036-3cd2-439e-b45b-eee63019ccab)

![EtchaSkect_tajihall](https://github.com/user-attachments/assets/6dd79036-3cd2-439e-b45b-eee63019ccab)

While `Andre Cassagnes` used static charges, aluminum powder, and two knobs, I wanted to explore what a digital version could be like.  

- `Induction Year`: 1998 (`National Toy Hall of Fame`)  
- In 1959, French electrical technician `André Cassagnes` introduced his `“L’Ecran Magique”` (*“the magic screen”*) at the `International Toy Fair` in Nuremberg Germany. Many initially passed on it, but the `Ohio Art Company` later invested in and rebranded it as the **Etch A Sketch**. By Christmas of 1960, television advertising had turned it into a cultural phenomenon. <br> 
- The toy worked by moving a stylus through aluminum powder between two knobs: horizontal and vertical. It left behind recognizable straight-line drawings. A quick shake erased the screen.  

I was inspired with the thought of this while on the phone with my mum. She had mentioned how I used to draw pictures on an Etch-a-Sketch, and that is about all it took for me to brainstorm this project idea.<br>

## Features

- **Embraces accessibility** (ARIA roles, keyboard shortcuts, live regions).  <br>
- **Gives creative control** (color pickers for background, tip, frame, and arrow hints).  <br>
- **Encourages play** in the same spirit as the original—simple rules, endless possibilities.  <br>
- **Adds resilience** through web security (CSP headers, no inline scripts, focus on safe input). <br>
- 
<img width="508" height="423" alt="Etchasketch_Mechanics" src="https://github.com/user-attachments/assets/8e8db819-5918-4b23-a5e6-137f8e8b37ea" />

## Controls:

Instead of twisting plastic knobs, you can guide the “`tip`” with `W/A/S/D` or the `Arrow Keys`.<br> 
Hold `Shift` to hover without drawing.
Press `N` for a *new* canvas.<br>

It’s my way of reimagining Cassagnes’ invention for today’s browsers while maintaining that sense of exploration.

## Menu Options:

1. `File`: <br>
    a. `New Page/Canvas`<br>
    b. `Save As (PNG)` <br>
    c. `Print`<br>
    d. `Exit`<br>
   
2. `Settings:` <br>
    a. `Background Color`<br>
    b. `Drawing Tip Color`<br>
    c. `Frame Color`<br>
    d. `Directional Arrows Color`<br>
    e. `Tip Width`<br>

---

## Logic Flow

Sketchy is a **event-driven design**, where every action - by pressing a key, choosing a color, 
or selecting a menu option - maps to a listener that updates the canvas or UI. <br>

***Initialzation***

- On load, the script sets the canvase size to match the display (Using `devicePixelRation`). <br>
- A starting "`tip`" is placed at `10%` from the `top-left corner`, with the first *dot* drawn. <br>

***Drawing Algorithm***

**Keyboard Input**: `keydown` (drawing) events translate into `dx/dy` offsets: <br>

```
    - `W` / ↑ = `(0, -step)`
    - `S` / ↓ = `(0, +step)`
    - `A` / ← = `(-step, 0)`
    - `D` / → = `(+step, 0)`

```

**Math Formula**:

```
pos.x = clamp(pos.x + dx, 0, canvas.width - 1)
pos.y = clamp(pos.y + dy, 0, canvas.height - 1)
```

A `clamp` prevents the cursor from leaving the canvas. <br>

### Drawing 

- Uses `ctx.lineTo` + `ctx.stroke()` this connects the previous and new postions,
then calls `arc(x, y, tipWidth/2, 0 2π)` to create smooth tips.<br>

### Undo / Ctrl+z

- After each stroke, the canvas `ImageData` is saved into a bounded history array (maximum 50 snapshots). <br>
- Pressing `Ctrl+z` restores the previous state, or `Undo` the previous move. <br>

### Preview Mode

- Holding `Shift` temporarily "ghosts" the stroke.<br>
- The canvas snapshot is immediately restored, so nothing is premantely drawn until you release `shift`.<br>

## Menus & Settings

- File actions: *New*, *Save As (PNG)*, *Print*, *Undo*, *Exit*.<br>
- Settings update CSS styles and live SVG colors dynamically (background, tip, frame, arrow stroke/fill, tip width).<br>

## Graceful Degradation  

- When pop-ups or features (`window.close()`) are blocked, the app announces fallback instructions instead of failing silently.<br>


- **Clamping** keeps drawing within bounds.  <br>
- **Inversion** (`255 – value`) for preview strokes.  <br>
- **Arc & Line Equations** ensure smooth continuous drawing.  <br>
- **Snapshot/restore** (image buffer stack) provides reliable undo.  <br>

---


## Accessibility & 508 Notes

1. Usable keyboard functions: <br>
    a. Menus & drawing option via keyboard; canvas has `tabindex="0"`. <br>

2. `ARIA` roles for menubar/menus; visible focus ring; skip‑link. <br>

3. Live region announces actions (new page, saved, color updates). <br>

4. Sufficient default contrast; user‑set colors warn if contrast may be low. <br>

5. Instructions available to screen readers and sighted users. <br>


---

### (09/22/2025.0830) ToDo's...

- Test the Accessibility functions. (09/22/2025.0830) Completed on:________
- Make the tip always visable. (09/22/2025.0830) Completed on:________

---

Noted Sources: <br>

`Etch-a-Sketch Wiki`:<br>
- https://en.wikipedia.org/wiki/Etch_A_Sketch <br>

`Meseumofplay - Etch-a-Sketch Blog`:<br>
- https://www.museumofplay.org/toys/etch-a-sketch/ <br>

- `Meseumofplay - Exhibits`:<br>
- https://www.museumofplay.org/exhibits/toy-hall-of-fame <br>
- online exhibits: - https://www.museumofplay.org/exhibits/online-exhibits/ <br>

`Ohio Art`: <br>
- https://ohioart.com/ <br>






