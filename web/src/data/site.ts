const publicProject = import.meta.env.PUBLIC_PROJECT_URL?.replace(/\/$/, '');
if (publicProject && !/^https:\/\/github\.com\/[\w.-]+\/[\w.-]+$/.test(publicProject)) {
  throw new Error('PUBLIC_PROJECT_URL must be a public GitHub repository URL.');
}

export const site = {
  name: 'focusphone',
  version: '1.0.6',
  publicProject: Boolean(publicProject),
  repository: publicProject ?? '/proyecto/',
  releases: publicProject ? `${publicProject}/releases` : '/instalar/#disponibilidad',
  documentation: publicProject ? `${publicProject}/tree/main/documentation/es` : '/instalar/',
  issues: publicProject ? `${publicProject}/issues` : '/#participa',
  description:
    'Un launcher minimalista para Android. Una pantalla de inicio de solo texto, perfiles de concentración y una pausa para volver a elegir. Descubre FocusPhone.'
};

export const faqs = [
  {
    question: '¿qué es un launcher? ¿cambia mi teléfono?',
    answer:
      'Es la aplicación que ves al pulsar el botón de inicio. FocusPhone sustituye esa pantalla por una interfaz más tranquila. Tus aplicaciones, fotos y archivos siguen donde estaban. Puedes volver a tu launcher anterior desde los ajustes de Android.'
  },
  {
    question: '¿funciona en mi móvil?',
    answer:
      'Necesitas Android 7.0 o posterior. No hace falta root ni crear una cuenta. FocusPhone es un launcher para Android; no está disponible para iPhone.'
  },
  {
    question: '¿dónde puedo descargarlo?',
    answer: publicProject
      ? 'El proyecto está en fase alpha, versión 1.0.6. Consulta los APK publicados en GitHub Releases y la guía de instalación. Todavía no se distribuye en Google Play.'
      : 'El proyecto está en fase alpha, versión 1.0.6. La descarga pública todavía no está disponible. Consulta su estado en la guía de instalación. Todavía no se distribuye en Google Play.'
  },
  {
    question: '¿tengo que desinstalar mis aplicaciones?',
    answer:
      'No. Elige hasta diez favoritas para tu inicio. Todas las demás siguen disponibles en el cajón de aplicaciones, con búsqueda y carpetas. Tú decides cuáles quieres tener más a mano.'
  },
  {
    question: '¿qué permisos necesita?',
    answer:
      'Lista las aplicaciones instaladas para que puedas abrirlas. El servicio de accesibilidad es opcional y permite aplicar bloqueos fuera del launcher y medir el tiempo para los límites diarios. El acceso a notificaciones también es opcional. Puedes usar la pantalla de inicio sin activar esos servicios.'
  },
  {
    question: '¿mis datos salen del teléfono?',
    answer:
      'La aplicación no declara permiso de Internet: no tiene cuentas, publicidad ni telemetría. Guarda la configuración en tu dispositivo. Los datos sensibles se cifran y están excluidos de las copias de seguridad. Al reinstalar o cambiar de móvil tendrás que configurar tus preferencias de nuevo.'
  }
];
