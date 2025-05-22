import { MutatingDots } from 'react-loader-spinner';

interface FullScreenLoaderProps {
  texto?: string;
}

export default function FullScreenLoader({ texto = "Carregando..." }: FullScreenLoaderProps) {
  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(255,255,255,0.9)',
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <MutatingDots
        height={100}
        width={100}
        color="#0F62FE"
        secondaryColor="#0F62FE"
        radius={12.5}
        ariaLabel="mutating-dots-loading"
        visible={true}
      />
      <h2 style={{ marginTop: 24 }}>{texto}</h2>
    </div>
  );
} 