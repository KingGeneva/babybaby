import React from "react";
import HeroSceneFallback from "./HeroSceneFallback";

interface State { failed: boolean }

class HeroSceneErrorBoundary extends React.Component<React.PropsWithChildren, State> {
  state: State = { failed: false };

  static getDerivedStateFromError(): State {
    return { failed: true };
  }

  componentDidCatch(error: Error) {
    console.info("Le décor 3D utilise son rendu statique de secours.", error.message);
  }

  render() {
    return this.state.failed ? <HeroSceneFallback /> : this.props.children;
  }
}

export default HeroSceneErrorBoundary;