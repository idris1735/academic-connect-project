class WebRTCService {
  constructor() {
    this.peerConnection = null
    this.localStream = null
    this.remoteStream = null
  }

  async startCall() {
    try {
      this.localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      this.peerConnection = new RTCPeerConnection({
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:stun1.l.google.com:19302' },
        ],
      })

      this.localStream.getTracks().forEach(track => {
        this.peerConnection.addTrack(track, this.localStream)
      })

      this.peerConnection.ontrack = (event) => {
        this.remoteStream = event.streams[0]
      }

      const offer = await this.peerConnection.createOffer()
      await this.peerConnection.setLocalDescription(offer)

      return offer
    } catch (error) {
      console.error('Error starting call:', error)
      throw error
    }
  }

  async handleAnswer(answer) {
    if (!this.peerConnection) throw new Error('Peer connection not initialized')

    try {
      await this.peerConnection.setRemoteDescription(new RTCSessionDescription(answer))
    } catch (error) {
      console.error('Error handling answer:', error)
      throw error
    }
  }

  async handleCandidate(candidate) {
    if (!this.peerConnection) throw new Error('Peer connection not initialized')

    try {
      await this.peerConnection.addIceCandidate(new RTCIceCandidate(candidate))
    } catch (error) {
      console.error('Error handling ICE candidate:', error)
      throw error
    }
  }

  endCall() {
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => track.stop())
    }
    if (this.peerConnection) {
      this.peerConnection.close()
    }
    this.localStream = null
    this.remoteStream = null
    this.peerConnection = null
  }

  toggleMute() {
    if (this.localStream) {
      const audioTrack = this.localStream.getAudioTracks()[0]
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled
        return !audioTrack.enabled
      }
    }
    return false
  }

  toggleVideo() {
    if (this.localStream) {
      const videoTrack = this.localStream.getVideoTracks()[0]
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled
        return !videoTrack.enabled
      }
    }
    return false
  }

  async toggleScreenShare() {
    if (!this.peerConnection) throw new Error('Peer connection not initialized')

    try {
      if (this.localStream.getVideoTracks()[0].label === 'screen') {
        const userStream = await navigator.mediaDevices.getUserMedia({ video: true })
        const videoTrack = userStream.getVideoTracks()[0]
        const sender = this.peerConnection.getSenders().find(s => s.track.kind === 'video')
        sender.replaceTrack(videoTrack)
        this.localStream.getVideoTracks()[0].stop()
        this.localStream = userStream
        return false
      } else {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true })
        const screenTrack = screenStream.getVideoTracks()[0]
        const sender = this.peerConnection.getSenders().find(s => s.track.kind === 'video')
        sender.replaceTrack(screenTrack)
        this.localStream.getVideoTracks()[0].stop()
        this.localStream = screenStream
        return true
      }
    } catch (error) {
      console.error('Error toggling screen share:', error)
      throw error
    }
  }
}

export default new WebRTCService()
