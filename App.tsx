import React, { useMemo, useState } from 'react';
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Avatar, Button, Card, Chip, IconButton, MD3LightTheme, PaperProvider, Searchbar } from 'react-native-paper';

type Vacancy = {
  id: number;
  role: string;
  company: string;
  area: string;
  mode: string;
  location: string;
  icon: string;
  description: string;
  technologies: string[];
  requirements: string[];
};

const vacancies: Vacancy[] = [
  {
    id: 1,
    role: 'Plataforma de analítica industrial',
    company: 'Coca-Cola',
    area: 'Desarrollo de software',
    mode: 'Híbrido',
    location: 'Ciudad de México',
    icon: 'CC',
    description: 'Desarrolla un tablero web para visualizar indicadores de producción y detectar oportunidades de mejora. La residencia incluye levantamiento de requerimientos, diseño de interfaz y conexión con datos de prueba.',
    technologies: ['React', 'APIs REST', 'SQL'],
    requirements: ['Ser estudiante y contar con disponibilidad para residencia profesional.', 'Conocimientos básicos de desarrollo web y bases de datos.', 'Entregar documentación y presentar el proyecto al equipo.'],
  },
  {
    id: 2,
    role: 'Aplicación de gestión de proyectos',
    company: 'Google',
    area: 'Desarrollo de software',
    mode: 'Remoto',
    location: 'Remoto · México',
    icon: 'G',
    description: 'Diseña un prototipo funcional para organizar tareas, responsables y avances de proyectos tecnológicos. Trabajarás con un mentor y aplicarás buenas prácticas de diseño centrado en las personas.',
    technologies: ['Kotlin', 'Firebase', 'UX'],
    requirements: ['Estudiante de ingeniería o carrera afín.', 'Conocimientos básicos de programación orientada a objetos.', 'Interés en aplicaciones móviles y trabajo colaborativo.'],
  },
  {
    id: 3,
    role: 'Sistema de mantenimiento predictivo',
    company: 'Audi',
    area: 'Industria 4.0',
    mode: 'Presencial',
    location: 'San José Chiapa, Puebla',
    icon: 'A',
    description: 'Crea una interfaz para registrar inspecciones y visualizar alertas de mantenimiento en equipos de producción. El proyecto contempla prototipado, desarrollo de módulos y pruebas con datos simulados.',
    technologies: ['.NET', 'SQL Server', 'Power BI'],
    requirements: ['Estudiante de sistemas, software o mecatrónica.', 'Bases de programación y bases de datos relacionales.', 'Disponibilidad para realizar la residencia en planta.'],
  },
  {
    id: 4,
    role: 'Digitalización de procesos de planta',
    company: 'Volkswagen',
    area: 'Desarrollo de software',
    mode: 'Híbrido',
    location: 'Puebla, Puebla',
    icon: 'VW',
    description: 'Desarrolla una herramienta interna para dar seguimiento a solicitudes y procesos del área de producción. Participarás en el análisis, construcción de módulos y elaboración de manuales.',
    technologies: ['Java', 'Spring Boot', 'MySQL'],
    requirements: ['Ser alumno activo con residencia profesional pendiente.', 'Conocimientos de programación y control de versiones.', 'Facilidad para documentar y comunicar avances.'],
  },
  {
    id: 5,
    role: 'Panel de monitoreo de sensores',
    company: 'Intel',
    area: 'Internet de las cosas',
    mode: 'Híbrido',
    location: 'Guadalajara, Jalisco',
    icon: 'i',
    description: 'Construye un panel web que reciba y visualice información de sensores conectados. La propuesta integra una API, almacenamiento de datos y alertas básicas para apoyar un proyecto de tecnología.',
    technologies: ['Python', 'Node.js', 'IoT'],
    requirements: ['Estudiante de ingeniería en sistemas, electrónica o afín.', 'Conocimientos básicos de programación y redes.', 'Interés en dispositivos conectados y visualización.'],
  },
];

type Screen = 'home' | 'explore' | 'saved' | 'applications' | 'profile' | 'detail';

function App() {
  const [screen, setScreen] = useState<Screen>('home');
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('Todas');
  const [selected, setSelected] = useState<Vacancy>(vacancies[0]);
  const [applied, setApplied] = useState<number[]>([]);
  const [saved, setSaved] = useState<number[]>([]);
  const [returnScreen, setReturnScreen] = useState<Screen>('explore');

  const filteredVacancies = useMemo(() => vacancies.filter(item => {
    const matchesQuery = `${item.role} ${item.company} ${item.area}`.toLowerCase().includes(query.toLowerCase());
    const matchesFilter = filter === 'Todas' || item.mode === filter;
    return matchesQuery && matchesFilter;
  }), [filter, query]);

  const openDetail = (vacancy: Vacancy) => {
    setSelected(vacancy);
    setReturnScreen(screen);
    setScreen('detail');
  };

  const toggleSaved = (vacancyId: number) => {
    setSaved(current => current.includes(vacancyId)
      ? current.filter(id => id !== vacancyId)
      : [...current, vacancyId]);
  };

  return (
    <PaperProvider
      theme={{ ...MD3LightTheme, colors: { ...MD3LightTheme.colors, primary: colors.purple, onPrimary: '#FFFFFF', secondary: colors.filterActive, background: colors.background, surface: colors.surface, onSurface: colors.ink } }}
      settings={{
        icon: ({ name, color, size }) => (
          <Text style={{ color, fontSize: size, textAlign: 'center' }}>
            {paperIconGlyphs[name] ?? '•'}
          </Text>
        ),
      }}
    >
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      {screen === 'detail' ? (
        <DetailScreen vacancy={selected} applied={applied.includes(selected.id)} saved={saved.includes(selected.id)} onToggleSaved={() => toggleSaved(selected.id)} onBack={() => setScreen(returnScreen)} onApply={() => setApplied(current => current.includes(selected.id) ? current : [...current, selected.id])} />
      ) : (
        <>
          <ScrollView contentContainerStyle={styles.page} showsVerticalScrollIndicator={false}>
            {screen === 'home' ? (
              <HomeScreen onExplore={() => setScreen('explore')} onNavigate={setScreen} applicationCount={applied.length} />
            ) : screen === 'explore' ? (
              <ExploreScreen query={query} setQuery={setQuery} filter={filter} setFilter={setFilter} items={filteredVacancies} savedIds={saved} onToggleSaved={toggleSaved} onBack={() => setScreen('home')} onOpen={openDetail} />
            ) : screen === 'saved' ? (
              <SavedScreen items={vacancies.filter(item => saved.includes(item.id))} onOpen={openDetail} onToggleSaved={toggleSaved} />
            ) : screen === 'applications' ? (
              <ApplicationsScreen items={vacancies.filter(item => applied.includes(item.id))} onOpen={openDetail} />
            ) : (
              <ProfileScreen onNavigate={setScreen} savedCount={saved.length} applicationCount={applied.length} />
            )}
          </ScrollView>
          <BottomBar active={screen} onNavigate={setScreen} />
        </>
      )}
    </SafeAreaView>
    </PaperProvider>
  );
}

function HomeScreen({ onExplore, onNavigate, applicationCount }: { onExplore: () => void; onNavigate: (screen: Screen) => void; applicationCount: number }) {
  return (
    <>
      <View style={styles.homeHeader}>
        <View style={styles.headerShapeOne} /><View style={styles.headerShapeTwo} />
        <View style={styles.homeHeaderRow}>
          <View style={styles.gradMark}><Text style={styles.gradMarkText}>▱</Text></View>
          <View style={styles.homeHeaderTitleWrap}><Text style={styles.homeHeaderTitle}>Gestor de{ '\n' }residencias profesionales</Text><Text style={styles.homeHeaderTagline}>Tu talento, nuestro futuro</Text></View>
          <TouchableOpacity onPress={() => onNavigate('applications')} style={styles.homeBell}><Text style={styles.homeBellGlyph}>♧</Text>{applicationCount > 0 && <View style={styles.homeBellBadge}><Text style={styles.homeBellBadgeText}>{applicationCount}</Text></View>}</TouchableOpacity>
        </View>
      </View>

      <Card mode="elevated" elevation={1} style={styles.studentCard}>
        <Card.Content style={styles.studentCardContent}>
          <Avatar.Text size={75} label="VO" style={styles.studentAvatar} labelStyle={styles.studentAvatarLabel} />
          <View style={styles.studentDivider} />
          <View style={styles.studentDetails}><Text style={styles.studentName}>Víctor Ocampo</Text><Text style={styles.studentCareer}>Ing. en Sistemas Computacionales</Text><Chip compact style={styles.semesterChip} textStyle={styles.semesterText}>Residencia profesional</Chip></View>
        </Card.Content>
      </Card>

      <View style={styles.homeActionGrid}>
        <HomeAction icon="▣" title="Mis postulaciones" onPress={() => onNavigate('applications')} />
        <HomeAction icon="▥" title="Empresas" onPress={onExplore} />
        <HomeAction icon="▤" title="Proyectos de residencia" onPress={onExplore} />
        <HomeAction icon="◇" title="Vacantes guardadas" onPress={() => onNavigate('saved')} />
      </View>

      <TouchableOpacity activeOpacity={0.9} onPress={() => onNavigate('applications')} style={styles.notificationPanel}>
        <View style={styles.notificationHeader}><View style={styles.notificationHeaderLeft}><Text style={styles.notificationIcon}>♧</Text><Text style={styles.notificationTitle}>Notificaciones</Text></View><Text style={styles.notificationAll}>Ver todas  ›</Text></View>
        <View style={styles.notificationBody}><View style={styles.notificationDot} /><View style={styles.notificationCopy}><Text style={styles.notificationMessage}>{applicationCount > 0 ? 'Revisa el estado de tus postulaciones' : 'Comienza tu búsqueda de residencia'}</Text><Text style={styles.notificationDate}>{applicationCount > 0 ? `${applicationCount} proyecto(s) enviado(s)` : 'Explora oportunidades disponibles'}</Text></View><Text style={styles.notificationChevron}>›</Text></View>
      </TouchableOpacity>

      <TouchableOpacity activeOpacity={0.9} onPress={() => onNavigate('profile')} style={styles.progressBanner}>
        <View style={styles.progressIcon}><Text style={styles.progressIconGlyph}>✦</Text></View>
        <View style={styles.progressDivider} />
        <View style={styles.progressTextWrap}><Text style={styles.progressTitle}>¡Sigue avanzando!</Text><Text style={styles.progressCopy}>Completa tu perfil y alcanza tus metas profesionales.</Text></View>
        <Text style={styles.progressArrow}>›</Text>
      </TouchableOpacity>
      <View style={styles.bottomSpace} />
    </>
  );
}

function HomeAction({ icon, title, onPress }: { icon: string; title: string; onPress: () => void }) {
  return <TouchableOpacity activeOpacity={0.85} onPress={onPress} style={styles.homeAction}>
    <Text style={styles.homeActionIcon}>{icon}</Text><Text style={styles.homeActionTitle}>{title}</Text><Text style={styles.homeActionArrow}>›</Text>
  </TouchableOpacity>;
}

function ExploreScreen({ query, setQuery, filter, setFilter, items, savedIds, onToggleSaved, onBack, onOpen }: {
  query: string; setQuery: (value: string) => void; filter: string; setFilter: (value: string) => void; items: Vacancy[]; savedIds: number[]; onToggleSaved: (vacancyId: number) => void; onBack: () => void; onOpen: (vacancy: Vacancy) => void;
}) {
  return (
    <>
      <View style={styles.topRow}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}><Text style={styles.backArrow}>‹</Text></TouchableOpacity>
        <View><Text style={styles.brandName}>Explorar</Text><Text style={styles.exploreKicker}>RESIDENCIAS PROFESIONALES</Text></View>
        <View style={styles.topSpacer} /><Avatar.Text size={38} label="VO" style={styles.paperAvatar} labelStyle={styles.paperAvatarLabel} />
      </View>
      <Text style={styles.exploreTitle}>Proyectos de tecnología{ '\n' }para desarrollar.</Text>
      <Searchbar value={query} onChangeText={setQuery} placeholder="Empresa, proyecto o área" style={styles.paperSearch} inputStyle={styles.paperSearchInput} iconColor={colors.purple} elevation={0} />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filtersRow}>
        {['Todas', 'Remoto', 'Híbrido', 'Presencial'].map(option => <Chip key={option} selected={filter === option} onPress={() => setFilter(option)} style={[styles.paperChip, filter === option && styles.paperChipActive]} textStyle={[styles.paperChipText, filter === option && styles.paperChipTextActive]} showSelectedCheck={false}>{option}</Chip>)}
      </ScrollView>
      <View style={styles.resultsHeader}><Text style={styles.sectionTitle}>Proyectos disponibles</Text><Text style={styles.resultsCount}>{items.length} resultados</Text></View>
      {items.length ? items.map(item => <VacancyCard key={item.id} vacancy={item} onPress={() => onOpen(item)} saved={savedIds.includes(item.id)} onToggleSaved={() => onToggleSaved(item.id)} />) : <View style={styles.emptyCard}><Text style={styles.emptyIcon}>⌕</Text><Text style={styles.emptyTitle}>No encontramos resultados</Text><Text style={styles.emptyCopy}>Prueba con otro término o cambia el filtro.</Text></View>}
      <View style={styles.bottomSpace} />
    </>
  );
}

function DetailScreen({ vacancy, applied, saved, onToggleSaved, onBack, onApply }: { vacancy: Vacancy; applied: boolean; saved: boolean; onToggleSaved: () => void; onBack: () => void; onApply: () => void }) {
  return (
    <View style={styles.detailRoot}>
      <ScrollView contentContainerStyle={styles.detailPage} showsVerticalScrollIndicator={false}>
        <View style={styles.detailTopRow}><TouchableOpacity onPress={onBack} style={styles.backButton}><Text style={styles.backArrow}>‹</Text></TouchableOpacity><Text style={styles.detailNavTitle}>Detalle de vacante</Text><IconButton icon={saved ? 'bookmark' : 'bookmark-outline'} iconColor={saved ? colors.filterActive : colors.ink} onPress={onToggleSaved} style={styles.detailBookmark} accessibilityLabel={saved ? 'Quitar de guardados' : 'Guardar vacante'} /></View>
        <CompanyLogo vacancy={vacancy} size={62} />
        <View style={styles.detailPill}><Text style={styles.detailPillText}>{vacancy.area.toUpperCase()}  ·  {vacancy.mode.toUpperCase()}</Text></View>
        <Text style={styles.detailTitle}>{vacancy.role}</Text>
        <Text style={styles.detailCompany}>{vacancy.company} <Text style={styles.verified}>✦</Text></Text>
        <View style={styles.detailMetaRow}><Meta icon="⌖" text={vacancy.location} /><Meta icon="◷" text="Hace 2 días" /></View>
        <View style={styles.residencyInfo}><Text style={styles.residencyInfoIcon}>◈</Text><View><Text style={styles.residencyInfoLabel}>MODALIDAD</Text><Text style={styles.residencyInfoValue}>Residencia profesional · {vacancy.mode}</Text></View></View>
        <Text style={styles.detailSectionTitle}>Sobre el proyecto</Text>
        <Text style={styles.detailBody}>{vacancy.description}</Text>
        <Text style={styles.detailSectionTitle}>Lo que vas a usar</Text>
        <View style={styles.tagsRow}>{vacancy.technologies.map(tag => <View key={tag} style={styles.techTag}><Text style={styles.techTagText}>{tag}</Text></View>)}</View>
        <Text style={styles.detailSectionTitle}>Lo que buscamos</Text>
        {vacancy.requirements.map((requirement, index) => <View key={requirement} style={styles.requirementRow}><View style={styles.requirementBullet}><Text style={styles.requirementBulletText}>{index + 1}</Text></View><Text style={styles.requirementText}>{requirement}</Text></View>)}
        <View style={styles.locationCard}><Text style={styles.locationPin}>⌖</Text><View><Text style={styles.locationTitle}>Ubicación</Text><Text style={styles.locationText}>{vacancy.location} · {vacancy.mode}</Text></View></View>
      </ScrollView>
      <View style={styles.applyBar}><Text style={styles.applyHint}>{applied ? 'Listo: tu interés fue registrado' : '¿Te interesa este proyecto?'}</Text><Button mode="contained" icon={applied ? 'check' : 'send-outline'} onPress={onApply} buttonColor={applied ? '#2D78C7' : colors.purple} textColor="white" style={styles.paperApplyButton} contentStyle={styles.paperApplyContent} labelStyle={styles.paperApplyLabel}>{applied ? 'Postulación enviada' : 'Postularme al proyecto'}</Button></View>
    </View>
  );
}

function VacancyCard({ vacancy, onPress, saved = false, onToggleSaved, statusLabel, compact = false }: { vacancy: Vacancy; onPress: () => void; saved?: boolean; onToggleSaved?: () => void; statusLabel?: string; compact?: boolean }) {
  return (
    <Card style={[styles.vacancyCard, compact && styles.vacancyCardCompact]} onPress={onPress} mode="elevated" elevation={1}>
      <Card.Content style={styles.vacancyCardContent}>
      <View style={styles.vacancyTop}><CompanyLogo vacancy={vacancy} size={46} /><View style={styles.vacancyTopText}><Text style={styles.vacancyCompany}>{vacancy.company}</Text><Text style={styles.vacancyArea}>{vacancy.area} · {vacancy.mode}</Text></View>{onToggleSaved ? <IconButton icon={saved ? 'bookmark' : 'bookmark-outline'} iconColor={saved ? colors.filterActive : colors.muted} size={19} onPress={event => { event.stopPropagation(); onToggleSaved(); }} style={styles.saveCardButton} accessibilityLabel={saved ? 'Quitar de guardados' : 'Guardar vacante'} /> : statusLabel ? <Chip compact style={styles.applicationStatusChip} textStyle={styles.applicationStatusText}>{statusLabel}</Chip> : null}</View>
      <Text style={styles.vacancyRole}>{vacancy.role}</Text>
      <View style={styles.vacancyBottom}><Text style={styles.vacancyLocation}>⌖  {vacancy.location}</Text></View>
      <View style={styles.vacancyFooter}><Chip compact style={styles.residencyChip} textStyle={styles.residencyChipText}>Residencia</Chip><Text style={styles.cardAction}>Ver proyecto  ↗</Text></View>
      </Card.Content>
    </Card>
  );
}

function CompanyLogo({ vacancy, size }: { vacancy: Vacancy; size: number }) {
  const logoStyle = [styles.companyLogo, { width: size, height: size, borderRadius: Math.min(16, size / 3) }];
  if (vacancy.company === 'Audi') {
    return <View style={[logoStyle, styles.audiLogo]}><View style={styles.audiRings}>{[0, 1, 2, 3].map(ring => <View key={ring} style={styles.audiRing} />)}</View></View>;
  }
  if (vacancy.company === 'Volkswagen') {
    return <View style={logoStyle}><View style={styles.vwLogo}><Text style={styles.vwLogoText}>VW</Text></View></View>;
  }
  if (vacancy.company === 'Coca-Cola') {
    return <View style={logoStyle}><Text style={styles.cocaLogo}>CC</Text></View>;
  }
  if (vacancy.company === 'Google') {
    return <View style={logoStyle}><Text style={styles.googleLogo}>G</Text></View>;
  }
  return <View style={logoStyle}><Text style={styles.intelLogo}>intel</Text></View>;
}

function SavedScreen({ items, onOpen, onToggleSaved }: { items: Vacancy[]; onOpen: (vacancy: Vacancy) => void; onToggleSaved: (vacancyId: number) => void }) {
  return <>
    <View style={styles.pageHeader}><Text style={styles.eyebrow}>TU LISTA PERSONAL</Text><Text style={styles.exploreTitle}>Vacantes guardadas</Text><Text style={styles.pageHeaderCopy}>Guarda proyectos para revisarlos cuando quieras.</Text></View>
    {items.length ? items.map(item => <VacancyCard key={item.id} vacancy={item} onPress={() => onOpen(item)} saved onToggleSaved={() => onToggleSaved(item.id)} />) : <EmptyState icon="◇" title="Aún no guardas vacantes" copy="Toca el marcador en una tarjeta para tenerla a la mano." />}
  </>;
}

function ApplicationsScreen({ items, onOpen }: { items: Vacancy[]; onOpen: (vacancy: Vacancy) => void }) {
  return <>
    <View style={styles.pageHeader}><Text style={styles.eyebrow}>SEGUIMIENTO</Text><Text style={styles.exploreTitle}>Mis postulaciones</Text><Text style={styles.pageHeaderCopy}>Aquí puedes volver a consultar los proyectos a los que te postulaste.</Text></View>
    {items.length ? items.map(item => <VacancyCard key={item.id} vacancy={item} onPress={() => onOpen(item)} statusLabel="ENVIADA" />) : <EmptyState icon="↗" title="Todavía no tienes postulaciones" copy="Explora los proyectos y postúlate para verlos aquí." />}
  </>;
}

function ProfileScreen({ onNavigate, savedCount, applicationCount }: { onNavigate: (screen: Screen) => void; savedCount: number; applicationCount: number }) {
  return <>
    <View style={styles.pageHeader}><Text style={styles.eyebrow}>ESPACIO PERSONAL</Text><Text style={styles.exploreTitle}>Mi perfil</Text></View>
    <Card mode="contained" style={styles.profileCard}>
      <Card.Content style={styles.profileContent}>
        <Avatar.Text size={74} label="VO" style={styles.profileAvatar} labelStyle={styles.profileAvatarLabel} />
        <Text style={styles.profileName}>Víctor Ocampo</Text>
        <Text style={styles.profileRole}>Estudiante · Desarrollo de software</Text>
        <View style={styles.profileTag}><Text style={styles.profileTagText}>Buscando residencia profesional</Text></View>
      </Card.Content>
    </Card>
    <View style={styles.profileStats}>
      <View style={styles.profileStat}><Text style={styles.profileStatValue}>{savedCount}</Text><Text style={styles.profileStatLabel}>Guardadas</Text></View>
      <View style={styles.profileStatDivider} />
      <View style={styles.profileStat}><Text style={styles.profileStatValue}>{applicationCount}</Text><Text style={styles.profileStatLabel}>Postulaciones</Text></View>
    </View>
    <Text style={styles.sectionTitle}>Accesos rápidos</Text>
    <Button mode="outlined" icon="bookmark-outline" onPress={() => onNavigate('saved')} style={styles.profileAction} textColor={colors.ink} contentStyle={styles.profileActionContent}>Ver vacantes guardadas</Button>
    <Button mode="contained" icon="arrow-top-right" onPress={() => onNavigate('applications')} style={styles.profileAction} buttonColor={colors.filterActive} textColor="white" contentStyle={styles.profileActionContent}>Ver mis postulaciones</Button>
  </>;
}

function EmptyState({ icon, title, copy }: { icon: string; title: string; copy: string }) {
  return <View style={styles.emptyCard}><Text style={styles.emptyIcon}>{icon}</Text><Text style={styles.emptyTitle}>{title}</Text><Text style={styles.emptyCopy}>{copy}</Text></View>;
}

function StatCard({ icon, value, label, tint }: { icon: string; value: string; label: string; tint: string }) {
  return <View style={styles.statCard}><View style={[styles.statIcon, { backgroundColor: tint }]}><Text style={styles.statIconText}>{icon}</Text></View><Text style={styles.statValue}>{value}</Text><Text style={styles.statLabel}>{label}</Text><View style={styles.statTrend}><Text style={styles.statTrendText}>↗  Este mes</Text></View></View>;
}

function Meta({ icon, text }: { icon: string; text: string }) {
  return <View style={styles.metaItem}><Text style={styles.metaIcon}>{icon}</Text><Text style={styles.metaText}>{text}</Text></View>;
}

function BottomBar({ active, onNavigate }: { active: Screen; onNavigate: (screen: Screen) => void }) {
  return <View style={styles.bottomBar}>
    <TouchableOpacity onPress={() => onNavigate('home')} style={styles.navItem}><Text style={[styles.navIcon, active === 'home' && styles.navIconActive]}>▦</Text><Text style={[styles.navLabel, active === 'home' && styles.navLabelActive]}>Inicio</Text></TouchableOpacity>
    <TouchableOpacity onPress={() => onNavigate('explore')} style={styles.navItem}><Text style={[styles.navIcon, active === 'explore' && styles.navIconActive]}>⌗</Text><Text style={[styles.navLabel, active === 'explore' && styles.navLabelActive]}>Explorar</Text></TouchableOpacity>
    <TouchableOpacity onPress={() => onNavigate('saved')} style={styles.navItem}><Text style={[styles.navIcon, active === 'saved' && styles.navIconActive]}>◇</Text><Text style={[styles.navLabel, active === 'saved' && styles.navLabelActive]}>Guardados</Text></TouchableOpacity>
    <TouchableOpacity onPress={() => onNavigate('applications')} style={styles.navItem}><Text style={[styles.navIcon, active === 'applications' && styles.navIconActive]}>↗</Text><Text style={[styles.navLabel, active === 'applications' && styles.navLabelActive]}>Postulaciones</Text></TouchableOpacity>
    <TouchableOpacity onPress={() => onNavigate('profile')} style={styles.navItem}><Text style={[styles.navIcon, active === 'profile' && styles.navIconActive]}>◉</Text><Text style={[styles.navLabel, active === 'profile' && styles.navLabelActive]}>Perfil</Text></TouchableOpacity>
  </View>;
}

const colors = { background: '#EEF6FF', surface: '#FFFFFF', border: '#D6E7F8', ink: '#14396F', muted: '#557394', purple: '#0D4F98', filterActive: '#1768B7', blueAccent: '#2D78C7', highlight: '#DCEEFF', line: '#D6E7F8' };
const paperIconGlyphs: Record<string, string> = {
  'bell-outline': '◉',
  'arrow-top-right': '⤴',
  check: '✓',
  'send-outline': '➜',
  magnify: '⌕',
  close: '×',
  bookmark: '◆',
  'bookmark-outline': '◇',
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background }, page: { paddingHorizontal: 22, paddingTop: 12 },
  homeHeader: { marginHorizontal: -22, marginTop: -12, marginBottom: -4, paddingHorizontal: 22, paddingTop: 22, paddingBottom: 39, backgroundColor: '#064B96', borderBottomLeftRadius: 34, borderBottomRightRadius: 34, overflow: 'hidden' }, headerShapeOne: { position: 'absolute', width: 230, height: 230, borderRadius: 120, backgroundColor: 'rgba(255,255,255,0.06)', right: -95, top: -133 }, headerShapeTwo: { position: 'absolute', width: 180, height: 180, borderRadius: 100, backgroundColor: 'rgba(42,139,232,0.24)', right: -48, bottom: -112 }, homeHeaderRow: { flexDirection: 'row', alignItems: 'center' }, gradMark: { width: 57, height: 57, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.14)', alignItems: 'center', justifyContent: 'center' }, gradMarkText: { color: 'white', fontSize: 43, lineHeight: 49, fontWeight: '900' }, homeHeaderTitleWrap: { marginLeft: 13, flex: 1 }, homeHeaderTitle: { color: 'white', fontSize: 19, lineHeight: 21, fontWeight: '900', letterSpacing: -0.4 }, homeHeaderTagline: { color: '#BBDFFF', fontSize: 10, marginTop: 5 }, homeBell: { width: 39, height: 42, alignItems: 'center', justifyContent: 'center', marginLeft: 3 }, homeBellGlyph: { color: 'white', fontSize: 25 }, homeBellBadge: { position: 'absolute', top: 1, right: 0, width: 17, height: 17, borderRadius: 9, backgroundColor: '#F04B54', alignItems: 'center', justifyContent: 'center' }, homeBellBadgeText: { color: 'white', fontSize: 9, fontWeight: '900' },
  studentCard: { backgroundColor: colors.surface, borderRadius: 22, marginTop: -18, marginBottom: 18, borderWidth: 1, borderColor: colors.border }, studentCardContent: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 16 }, studentAvatar: { backgroundColor: '#B6D9F8' }, studentAvatarLabel: { color: '#0D4F98', fontWeight: '900' }, studentDivider: { width: 2, height: 68, backgroundColor: '#91C3F2', marginHorizontal: 14 }, studentDetails: { flex: 1 }, studentName: { color: colors.ink, fontSize: 17, fontWeight: '900', letterSpacing: -0.4 }, studentCareer: { color: colors.muted, fontSize: 11, marginTop: 4 }, semesterChip: { alignSelf: 'flex-start', marginTop: 8, backgroundColor: '#D9ECFF', height: 26 }, semesterText: { color: '#0D4F98', fontSize: 9, fontWeight: '800', marginVertical: 0 },
  homeActionGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 7 }, homeAction: { width: '48.5%', minHeight: 102, backgroundColor: '#D9ECFF', borderRadius: 19, paddingHorizontal: 13, paddingVertical: 12, marginBottom: 11, flexDirection: 'row', alignItems: 'center' }, homeActionIcon: { color: '#0D4F98', fontSize: 31, width: 40, textAlign: 'center', fontWeight: '900' }, homeActionTitle: { flex: 1, color: '#153B71', fontSize: 11, lineHeight: 14, fontWeight: '800', marginLeft: 7 }, homeActionArrow: { color: '#0D4F98', fontSize: 23, marginLeft: 2 },
  notificationPanel: { backgroundColor: colors.surface, borderRadius: 19, overflow: 'hidden', marginBottom: 14, borderWidth: 1, borderColor: colors.border }, notificationHeader: { minHeight: 49, backgroundColor: '#064B96', paddingHorizontal: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }, notificationHeaderLeft: { flexDirection: 'row', alignItems: 'center' }, notificationIcon: { color: 'white', fontSize: 20, marginRight: 9 }, notificationTitle: { color: 'white', fontSize: 14, fontWeight: '900' }, notificationAll: { color: 'white', fontSize: 10, fontWeight: '700' }, notificationBody: { minHeight: 70, paddingHorizontal: 14, paddingVertical: 12, flexDirection: 'row', alignItems: 'center' }, notificationDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#0D63B8', marginRight: 12 }, notificationCopy: { flex: 1 }, notificationMessage: { color: colors.ink, fontSize: 12, fontWeight: '800' }, notificationDate: { color: colors.muted, fontSize: 10, marginTop: 4 }, notificationChevron: { color: '#0D4F98', fontSize: 26, paddingLeft: 6 },
  progressBanner: { minHeight: 116, borderRadius: 21, backgroundColor: '#C9E4FF', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 13, overflow: 'hidden' }, progressIcon: { width: 78, height: 82, backgroundColor: '#A9D2F8', borderRadius: 20, alignItems: 'center', justifyContent: 'center' }, progressIconGlyph: { color: '#064B96', fontSize: 44, fontWeight: '900' }, progressDivider: { width: 2, height: 74, backgroundColor: '#438BD2', marginHorizontal: 13 }, progressTextWrap: { flex: 1 }, progressTitle: { color: '#14396F', fontSize: 16, fontWeight: '900' }, progressCopy: { color: '#194D87', fontSize: 11, lineHeight: 16, marginTop: 4 }, progressArrow: { color: '#0D4F98', fontSize: 23, marginLeft: 5 },
  topRow: { flexDirection: 'row', alignItems: 'center', minHeight: 46, marginBottom: 25 }, brandMark: { width: 32, height: 32, borderRadius: 10, backgroundColor: colors.purple, alignItems: 'center', justifyContent: 'center' }, brandMarkText: { color: '#101724', fontSize: 21, fontWeight: '900' }, brandName: { color: colors.ink, fontSize: 12, lineHeight: 15, maxWidth: 180, fontWeight: '900', marginLeft: 9, letterSpacing: -0.2 }, topSpacer: { flex: 1 }, bellButton: { height: 38, width: 38, backgroundColor: colors.surface, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginRight: 11 }, bellIcon: { color: colors.ink, fontSize: 21, transform: [{ rotate: '180deg' }] }, avatar: { width: 38, height: 38, borderRadius: 14, backgroundColor: '#F4D1C9', alignItems: 'center', justifyContent: 'center' }, avatarText: { color: '#7F5149', fontSize: 12, fontWeight: '800' },
  paperIconButton: { backgroundColor: colors.surface, borderRadius: 14, margin: 0, marginRight: 9 }, paperAvatar: { backgroundColor: '#F4D1C9', borderRadius: 14 }, paperAvatarLabel: { color: '#7F5149', fontSize: 12, fontWeight: '800' },
  greetingBlock: { marginBottom: 21 }, eyebrow: { color: colors.muted, fontSize: 9, letterSpacing: 1.4, fontWeight: '800', marginBottom: 8 }, greeting: { fontSize: 27, lineHeight: 33, fontWeight: '800', color: colors.ink, letterSpacing: -0.8 }, wave: { color: '#F5A257', fontSize: 22 }, subtitle: { color: colors.muted, fontSize: 13, marginTop: 4 },
  heroCard: { backgroundColor: '#0D4F98', borderRadius: 25, minHeight: 270, padding: 22, overflow: 'hidden', marginBottom: 27 }, heroLabel: { color: '#BBDFFF', fontSize: 9, letterSpacing: 1.3, fontWeight: '800', marginBottom: 12 }, heroTitle: { color: 'white', fontSize: 27, lineHeight: 31, letterSpacing: -0.7, fontWeight: '900', maxWidth: 240 }, heroCopy: { color: '#D5E9FF', fontSize: 11, lineHeight: 16, maxWidth: 220, marginTop: 10 }, heroButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.ink, paddingVertical: 11, paddingHorizontal: 15, borderRadius: 12, alignSelf: 'flex-start', marginTop: 16 }, heroButtonText: { color: colors.ink, fontSize: 11, fontWeight: '800' }, heroButtonArrow: { marginLeft: 14, color: colors.purple, fontSize: 16, fontWeight: '700' }, heroOrbOne: { position: 'absolute', width: 220, height: 220, borderRadius: 110, borderWidth: 1, borderColor: 'rgba(255,255,255,0.18)', right: -70, top: 48 }, heroOrbTwo: { position: 'absolute', width: 155, height: 155, borderRadius: 80, borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)', right: -37, top: 80 }, heroSpark: { position: 'absolute', color: '#A9D2F8', right: 34, top: 50, fontSize: 48 },
  heroPaperButton: { alignSelf: 'flex-start', marginTop: 14, borderRadius: 12, backgroundColor: '#FFFFFF' }, paperButtonContent: { minHeight: 40, flexDirection: 'row-reverse' }, paperButtonLabel: { color: colors.purple, fontSize: 11, fontWeight: '800', marginHorizontal: 12 },
  sectionHeading: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 13 }, sectionTitle: { color: colors.ink, fontSize: 16, fontWeight: '800', letterSpacing: -0.3 }, sectionSubtitle: { color: colors.muted, fontSize: 10, marginTop: 4 }, moreButton: { color: '#A2A4B2', fontSize: 16, letterSpacing: 2 }, seeAll: { color: colors.purple, fontSize: 11, fontWeight: '700' },
  statsRow: { flexDirection: 'row', marginHorizontal: -5, marginBottom: 27 }, statCard: { flex: 1, backgroundColor: colors.surface, borderRadius: 18, marginHorizontal: 5, padding: 14, borderWidth: 1, borderColor: colors.border }, statIcon: { width: 30, height: 30, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginBottom: 11 }, statIconText: { fontSize: 17, color: colors.purple }, statValue: { fontSize: 23, fontWeight: '800', color: colors.ink }, statLabel: { color: colors.muted, fontSize: 10, marginTop: 2 }, statTrend: { marginTop: 12, alignSelf: 'flex-start', backgroundColor: '#E4F1FF', borderRadius: 7, paddingHorizontal: 7, paddingVertical: 4 }, statTrendText: { color: colors.blueAccent, fontSize: 8, fontWeight: '700' },
  vacancyCard: { backgroundColor: colors.surface, borderRadius: 19, padding: 0, marginBottom: 12, borderWidth: 1, borderColor: colors.border }, vacancyCardCompact: { borderRadius: 16 }, vacancyTop: { flexDirection: 'row', alignItems: 'center' }, companyIcon: { width: 41, height: 41, borderRadius: 14, justifyContent: 'center', alignItems: 'center' }, companyEmoji: { fontSize: 15, fontWeight: '900', color: colors.ink }, vacancyTopText: { flex: 1, marginLeft: 10 }, vacancyCompany: { color: colors.ink, fontSize: 12, fontWeight: '800' }, vacancyArea: { color: colors.muted, fontSize: 9, marginTop: 4 }, heartButton: { width: 30, height: 30, borderRadius: 10, backgroundColor: '#202D40', alignItems: 'center', justifyContent: 'center' }, heartIcon: { fontSize: 18, color: colors.muted }, vacancyRole: { color: colors.ink, fontSize: 15, fontWeight: '800', marginTop: 13, letterSpacing: -0.2 }, vacancyBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }, vacancyLocation: { color: colors.muted, fontSize: 9 }, vacancyFooter: { borderTopWidth: 1, borderTopColor: colors.border, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 12, paddingTop: 10 }, cardAction: { color: colors.purple, fontSize: 10, fontWeight: '700' },
  vacancyCardContent: { padding: 15 }, residencyChip: { backgroundColor: '#D9ECFF', height: 27 }, residencyChipText: { color: colors.purple, fontSize: 9, lineHeight: 14 },
  noticeCard: { marginTop: 5, padding: 13, borderRadius: 15, flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, marginBottom: 10 }, noticeIcon: { width: 34, height: 34, borderRadius: 11, backgroundColor: '#D9ECFF', alignItems: 'center', justifyContent: 'center' }, noticeTextWrap: { flex: 1, marginLeft: 10 }, noticeTitle: { color: colors.ink, fontSize: 10, fontWeight: '800' }, noticeCopy: { color: colors.muted, fontSize: 9, marginTop: 3, lineHeight: 13 }, noticeArrow: { color: colors.purple, fontSize: 23, marginLeft: 5 }, bottomSpace: { height: 16 },
  bottomBar: { height: 67, backgroundColor: colors.surface, borderTopWidth: 1, borderTopColor: colors.border, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', paddingBottom: 5 }, navItem: { alignItems: 'center', justifyContent: 'center', flex: 1 }, navIcon: { fontSize: 19, color: colors.muted, lineHeight: 23 }, navIconActive: { color: colors.purple }, navLabel: { fontSize: 7, color: colors.muted, marginTop: 3 }, navLabelActive: { color: colors.purple, fontWeight: '800' },
  backButton: { width: 38, height: 38, backgroundColor: colors.surface, borderRadius: 13, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.border }, backArrow: { color: colors.ink, fontSize: 29, lineHeight: 32, marginTop: -3 }, exploreKicker: { color: colors.muted, fontSize: 8, letterSpacing: 1.1, marginLeft: 9, marginTop: 3, fontWeight: '700' }, exploreTitle: { color: colors.ink, fontSize: 29, lineHeight: 34, fontWeight: '800', letterSpacing: -0.8, marginBottom: 19 }, searchBox: { height: 49, borderRadius: 14, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 13 }, searchIcon: { color: colors.purple, fontSize: 23, marginRight: 9 }, searchInput: { flex: 1, fontSize: 11, color: colors.ink, paddingVertical: 0 }, searchTune: { color: colors.purple, fontSize: 20, paddingHorizontal: 4 }, filtersRow: { paddingVertical: 16 }, filterChip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, marginRight: 8 }, filterChipActive: { backgroundColor: colors.purple, borderColor: colors.purple }, filterText: { color: colors.muted, fontSize: 10, fontWeight: '600' }, filterTextActive: { color: 'white' }, resultsHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 13 }, resultsCount: { color: colors.muted, fontSize: 10 }, 
  paperSearch: { backgroundColor: colors.surface, borderRadius: 14, borderWidth: 1, borderColor: colors.border }, paperSearchInput: { fontSize: 11 }, paperChip: { backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1, marginRight: 8 }, paperChipActive: { backgroundColor: colors.filterActive, borderColor: colors.filterActive }, paperChipText: { color: colors.muted, fontSize: 10 }, paperChipTextActive: { color: 'white' },
  companyLogo: { backgroundColor: '#F7F8FC', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }, cocaLogo: { color: '#D22F36', fontSize: 17, fontWeight: '900', fontStyle: 'italic', letterSpacing: -1.5 }, googleLogo: { color: '#4285F4', fontSize: 28, fontWeight: '900' }, audiLogo: { backgroundColor: '#E9EDF2' }, audiRings: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }, audiRing: { width: 12, height: 12, borderRadius: 7, borderWidth: 1.8, borderColor: '#303B49', marginHorizontal: -2.8 }, vwLogo: { width: '72%', height: '72%', borderRadius: 50, borderWidth: 2, borderColor: '#1E4E8C', alignItems: 'center', justifyContent: 'center' }, vwLogoText: { color: '#1E4E8C', fontSize: 15, fontWeight: '900' }, intelLogo: { color: '#0875BC', fontSize: 15, fontWeight: '900', fontStyle: 'italic', letterSpacing: -1 },
  pageHeader: { marginTop: 8, marginBottom: 18 }, pageHeaderCopy: { color: colors.muted, fontSize: 11, lineHeight: 16, marginTop: -10 }, emptyCard: { paddingVertical: 38, paddingHorizontal: 25, backgroundColor: colors.surface, borderRadius: 20, alignItems: 'center', borderWidth: 1, borderColor: colors.line }, emptyIcon: { fontSize: 30, color: colors.purple }, emptyTitle: { marginTop: 10, color: colors.ink, fontWeight: '800', fontSize: 14, textAlign: 'center' }, emptyCopy: { marginTop: 5, color: colors.muted, fontSize: 10, textAlign: 'center', lineHeight: 15 }, applicationStatusChip: { backgroundColor: '#DCEEFF' }, applicationStatusText: { color: colors.blueAccent, fontSize: 8, fontWeight: '800' },
  saveCardButton: { margin: 0 }, detailBookmark: { margin: 0, width: 38, height: 38 }, profileCard: { backgroundColor: colors.surface, borderRadius: 24, borderWidth: 1, borderColor: colors.border }, profileContent: { alignItems: 'center', paddingVertical: 25 }, profileAvatar: { backgroundColor: colors.filterActive }, profileAvatarLabel: { color: 'white', fontWeight: '900' }, profileName: { color: colors.ink, fontSize: 20, fontWeight: '900', marginTop: 15 }, profileRole: { color: colors.muted, fontSize: 11, marginTop: 5 }, profileTag: { marginTop: 15, borderRadius: 10, paddingHorizontal: 11, paddingVertical: 7, backgroundColor: '#DCEEFF' }, profileTagText: { color: colors.blueAccent, fontSize: 9, fontWeight: '800' }, profileStats: { backgroundColor: colors.surface, borderRadius: 17, borderWidth: 1, borderColor: colors.border, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', paddingVertical: 17, marginVertical: 16 }, profileStat: { alignItems: 'center', flex: 1 }, profileStatValue: { color: colors.ink, fontSize: 21, fontWeight: '900' }, profileStatLabel: { color: colors.muted, fontSize: 9, marginTop: 3 }, profileStatDivider: { width: 1, height: 32, backgroundColor: colors.border }, profileAction: { borderRadius: 14, marginTop: 12 }, profileActionContent: { minHeight: 48 },
  detailRoot: { flex: 1, backgroundColor: colors.background }, detailPage: { paddingHorizontal: 22, paddingTop: 12, paddingBottom: 24 }, detailTopRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 22 }, detailNavTitle: { flex: 1, textAlign: 'center', color: colors.ink, fontSize: 13, fontWeight: '800' }, saveButton: { width: 38, height: 38, borderRadius: 13, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.border }, saveIcon: { color: colors.purple, fontSize: 21 }, detailCompanyIcon: { width: 58, height: 58, borderRadius: 18, justifyContent: 'center', alignItems: 'center', marginBottom: 16 }, detailEmoji: { fontSize: 22, fontWeight: '900', color: colors.ink }, detailPill: { alignSelf: 'flex-start', backgroundColor: '#D9ECFF', borderRadius: 8, paddingHorizontal: 9, paddingVertical: 6 }, detailPillText: { color: colors.purple, fontSize: 8, fontWeight: '800', letterSpacing: 0.7 }, detailTitle: { color: colors.ink, fontWeight: '900', fontSize: 25, lineHeight: 30, letterSpacing: -0.7, marginTop: 11 }, detailCompany: { color: colors.muted, fontSize: 12, marginTop: 5, fontWeight: '600' }, verified: { color: colors.purple, fontSize: 12 }, detailMetaRow: { flexDirection: 'row', marginTop: 14, marginBottom: 18 }, metaItem: { flexDirection: 'row', alignItems: 'center', marginRight: 18 }, metaIcon: { color: colors.purple, fontSize: 15, marginRight: 4 }, metaText: { color: colors.muted, fontSize: 9 }, residencyInfo: { flexDirection: 'row', alignItems: 'center', padding: 14, backgroundColor: colors.surface, borderRadius: 16, borderWidth: 1, borderColor: colors.border, marginBottom: 19 }, residencyInfoIcon: { width: 35, height: 35, borderRadius: 11, backgroundColor: colors.highlight, textAlign: 'center', textAlignVertical: 'center', color: colors.purple, fontSize: 18, fontWeight: '700', marginRight: 11 }, residencyInfoLabel: { color: colors.muted, fontSize: 8, fontWeight: '800', letterSpacing: 0.7 }, residencyInfoValue: { color: colors.ink, fontSize: 12, fontWeight: '800', marginTop: 4 }, detailSectionTitle: { color: colors.ink, fontSize: 15, fontWeight: '800', marginBottom: 9, marginTop: 5 }, detailBody: { color: colors.muted, fontSize: 11, lineHeight: 18, marginBottom: 18 }, tagsRow: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 18 }, techTag: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 7, marginRight: 7, marginBottom: 5 }, techTagText: { color: colors.ink, fontSize: 9, fontWeight: '600' }, requirementRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 8 }, requirementBullet: { width: 20, height: 20, borderRadius: 7, backgroundColor: '#D9ECFF', justifyContent: 'center', alignItems: 'center', marginRight: 9 }, requirementBulletText: { color: colors.purple, fontSize: 9, fontWeight: '800' }, requirementText: { flex: 1, color: colors.muted, fontSize: 10, lineHeight: 15, paddingTop: 2 }, locationCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, borderRadius: 14, borderWidth: 1, borderColor: colors.border, padding: 13, marginTop: 8, marginBottom: 10 }, locationPin: { color: colors.purple, fontSize: 21, marginRight: 11 }, locationTitle: { color: colors.ink, fontSize: 10, fontWeight: '800' }, locationText: { color: colors.muted, fontSize: 9, marginTop: 4 }, applyBar: { backgroundColor: colors.surface, borderTopWidth: 1, borderTopColor: colors.border, paddingHorizontal: 22, paddingTop: 12, paddingBottom: 16, shadowColor: '#000000', shadowOpacity: 0.2, shadowRadius: 12, elevation: 8 }, applyHint: { textAlign: 'center', color: colors.muted, fontSize: 9, marginBottom: 8 },
  paperApplyButton: { borderRadius: 16 }, paperApplyContent: { minHeight: 56 }, paperApplyLabel: { fontSize: 13, fontWeight: '900' },
});

export default App;
