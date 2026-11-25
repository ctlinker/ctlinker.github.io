import { CommandRegister } from "./_type";
import { about } from "./about";
import { projects } from "./projects";
import { skills } from "./skills";
import { contact } from "./contact";
import { fastfetch } from "./fastfetch";
import { help, theme, accent, lang, photobook, pong, spaceshooter, heatmap, clear, sudo, reboot, echo, cowsay, tuxsay, ls, cd } from "./system";

/** Registration order = chip order. */
export const register = new CommandRegister()
  .register(about)
  .register(projects)
  .register(skills)
  .register(heatmap)
  .register(contact)
  .register(fastfetch)
  .register(help)
  .register(theme)
  .register(accent)
  .register(lang)
  .register(photobook)
  .register(pong)
  .register(spaceshooter)
  .register(clear)
  .register(sudo)
  .register(reboot)
  .register(echo)
  .register(cowsay)
  .register(tuxsay)
  .register(ls)
  .register(cd);
