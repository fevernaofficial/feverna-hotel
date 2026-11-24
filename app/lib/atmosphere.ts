export const HOTEL_ATMOSPHERE_EVENT = "feverna:atmosphere";
export const HOTEL_SOUND_STATE_EVENT = "feverna:sound-state";

export type AtmosphereEnvironment = "interior" | "exterior";

export type AtmosphereEvent =
  | { action: "fadeOut"; seconds?: number }
  | { action: "fadeIn"; seconds?: number }
  | { action: "fadeInAfterSilence"; silenceSeconds?: number; seconds?: number }
  | {
      action: "setEnvironment";
      environment: AtmosphereEnvironment;
      seconds?: number;
    }
  | { action: "suppress"; seconds?: number }
  | { action: "release"; seconds?: number }
  | { action: "stop" };

export type HotelSoundStateEvent = { enabled: boolean };

export function setAtmosphereEnvironment(
  environment: AtmosphereEnvironment,
  seconds = 1.8
) {
  window.dispatchEvent(
    new CustomEvent<AtmosphereEvent>(HOTEL_ATMOSPHERE_EVENT, {
      detail: { action: "setEnvironment", environment, seconds },
    })
  );
}

export function suppressHotelAtmosphere(seconds = 1.2) {
  window.dispatchEvent(
    new CustomEvent<AtmosphereEvent>(HOTEL_ATMOSPHERE_EVENT, {
      detail: { action: "suppress", seconds },
    })
  );
}

export function releaseHotelAtmosphere(seconds = 1.8) {
  window.dispatchEvent(
    new CustomEvent<AtmosphereEvent>(HOTEL_ATMOSPHERE_EVENT, {
      detail: { action: "release", seconds },
    })
  );
}
