/**
 * Proximo Evento page copy. Source: caribbeanfishingacademy.com/proximo-evento.html,
 * a Spanish-language event page aimed at local Puerto Rican families for the
 * Torneo de Pesca Infantil at Marina Puerto del Rey. Kept in Spanish to match
 * the source audience. Every date, time, age range and dollar figure below is
 * exact from the source.
 */
import type { PageContent, Cta, Img, Feature, FaqItem, SectionHeading } from "./types";

export const proximoEvento = {
  meta: {
    title: "Proximo Evento",
    description:
      "Torneo de Pesca Infantil en los muelles de la Marina Puerto del Rey, 19 de octubre, organizado por Caribbean Fishing Academy y Safe Harbor Puerto del Rey.",
    path: "/proximo-evento",
  },

  hero: {
    eyebrow: "Proximo evento",
    title: "Torneo de Pesca Infantil",
    image: {
      src: "/ingested/caribbeanfishingacademy/kids-tournament-flyer.webp",
      alt: "Volante del Torneo de Pesca Infantil con un nino sosteniendo un pez, los detalles del torneo y los logos de Suzuki Marine y Safe Harbor Puerto del Rey",
    } as Img,
    ctas: [
      { label: "Inscripciones aqui", href: "/contact-us", variant: "primary" },
      { label: "Ver preguntas", href: "#preguntas", variant: "secondary" },
    ] as Cta[],
    facts: [
      { icon: "pin", label: "Fecha", value: "19 de octubre" },
      { icon: "clock", label: "Horario", value: "8:00 AM a 12:00 PM" },
      { icon: "users", label: "Edades", value: "2 a 14 anos" },
    ] as { icon: "clock" | "users" | "pin"; label: string; value: string }[],
  },

  detailsHeading: {
    eyebrow: "Detalles del torneo",
    title: "Te invita Safe Harbor Puerto del Rey en colaboracion con CFA",
    body:
      "Torneo de pesca en los muelles de la marina Puerto del Rey. 19 de octubre de 2024, de 8am a 12pm. Es un torneo de pesca de muelle para los ninos. Forma parte de las actividades del torneo de pesca mar afuera de adultos organizado por Safe Harbor Puerto del Rey Marina de Fajardo, del 18 al 19 de octubre de 2024. El torneo esta disenado para fomentar la union familiar y la pesca como actividad extracurricular entre todos los miembros de la familia, en un entorno de diversion y sana competencia.",
  } as SectionHeading,

  eventFacts: [
    {
      icon: "CalendarDays",
      title: "19 de octubre",
      body: "Fecha del torneo de pesca infantil en los muelles de la Marina Puerto del Rey.",
    },
    {
      icon: "Clock",
      title: "8:00 AM a 12:00 PM",
      body: "Horario del torneo, parte de las actividades del fin de semana familiar.",
    },
    {
      icon: "Users",
      title: "2 a 14 anos",
      body: "Edades permitidas para los ninos que participan en el torneo de muelle.",
    },
    {
      icon: "Gift",
      title: "$10 de donativo",
      body: "Incluye equipo de pesca, almuerzo, musica, regalos y premios a los ganadores.",
    },
  ] as Feature[],

  registration: {
    heading: {
      eyebrow: "Inscripciones",
      title: "Inscribe a tu familia",
      body: "Para mas informacion, favor de enviar mensaje de texto al 787-405-4100.",
    } as SectionHeading,
    primary: { label: "Inscripciones aqui", href: "/contact-us", variant: "primary" } as Cta,
  },

  faqHeading: {
    eyebrow: "Preguntas y respuestas",
    title: "Preguntas y Respuestas",
  } as SectionHeading,

  faqs: [
    {
      q: "Se le proveera el equipo de pesca y la carnada?",
      a: "Si.",
    },
    {
      q: "Pueden traer su propia cana de pescar y carnada?",
      a: "Si. Se permitira traer su propia cana de pescar y carnada. Los que lo hagan seran inscritos en la categoria de 12 a 14 anos, independientemente de su edad, y seran responsables de su propio equipo y su preparacion.",
    },
    {
      q: "Debo llevar silla de playa y sombrilla?",
      a: "Si. Es altamente recomendado.",
    },
    {
      q: "Puedo dejar los ninos solos en la actividad?",
      a: "No. El proposito de la actividad es promover la union familiar y la pesca como pasatiempo extracurricular entre la familia, ademas de mantener un ambiente seguro para todos. Todos los menores deben estar acompanados de al menos un adulto encargado.",
    },
    {
      q: "Los padres o adultos encargados pueden asistir a los ninos durante la pesca?",
      a: "Si, con la excepcion del proceso de la pelea de todo pez anzuelado. Fuera de eso, pueden asistirlos en todo lo necesario para que aprendan y compartan juntos durante la actividad.",
    },
  ] as FaqItem[],

  closingNote:
    "Gracias por contactarnos. Pronto le atenderemos, o si prefiere, puede enviarnos un mensaje de texto al 787-405-4100.",
} satisfies PageContent & Record<string, unknown>;

export default proximoEvento;
