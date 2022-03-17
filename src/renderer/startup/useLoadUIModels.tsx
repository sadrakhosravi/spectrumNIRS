// import { useAppSelector } from '@redux/hooks/hooks';
// import { useEffect } from 'react';
// import ExperimentUI from 'renderer/UIModels/ExperimentUI';
// import RecordingUI from 'renderer/UIModels/RecordingUI';

// const useLoadUIModels = () => {
//   const experimentId = useAppSelector(
//     (state) => state.global.experiment?.currentExp?.id
//   );
//   const recordingId = useAppSelector(
//     (state) => state.global.recording?.currentRecording?.id
//   );

//   useEffect(() => {
//     //@ts-ignore
//     let experimentUIModel;
//     if (experimentId) {
//       experimentUIModel = new ExperimentUI();
//     }
//     return () => {
//       //@ts-ignore
//       experimentUIModel = undefined;
//     };
//   }, [experimentId]);

//   useEffect(() => {
//     //@ts-ignore
//     let recordingUIModel;
//     if (recordingId) {
//       recordingUIModel = new RecordingUI();
//     }
//     return () => {
//       //@ts-ignore
//       recordingUIModel = undefined;
//     };
//   }, [recordingId]);
// };
// export default useLoadUIModels;
