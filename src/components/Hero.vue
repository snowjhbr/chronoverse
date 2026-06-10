<script setup>

</script>

<template>
  <div>
    <h3 class="text-xl text-center font-medium text-[#D4D4F0]">AVATAR INTEROPERÁVEL</h3>
    <div class="relative mx-auto w-full max-w-40 flex justify-center avatar-container">
      <div class="avatar-glow"></div>

      <img src="../assets/avatar-original.png" alt="" class="relative z-10 w-full h-auto">
    </div>

    <div class="border-2 border-[#16162A] bg-[#0F0F1E] rounded-lg p-2.5 shadow-lg mb-2.5 mt-5">
      <h3 class="text-md font-thin">SKILLS E CONQUISTAS GLOBAIS</h3>
      <span class="block my-2 w-full h-px bg-[#16162A]"></span>

      <div class="grid grid-cols-4 gap-3">
        <div>
          <div class="w-20 h-20 rounded-full bg-[#2A2A4A] animate-pulse"></div>
          <span class="text-xs block mx-auto text-center mt-1">Conquista 1</span>
        </div>
        <div>
          <div class="w-20 h-20 rounded-full bg-[#2A2A4A] animate-pulse"></div>
          <span class="text-xs block mx-auto text-center mt-1">Conquista 2</span>
        </div>
        <div>
          <div class="w-20 h-20 rounded-full bg-[#2A2A4A] animate-pulse"></div>
          <span class="text-xs block mx-auto text-center mt-1">Conquista 3</span>
        </div>
        <div>
          <div class="w-20 h-20 rounded-full bg-[#2A2A4A] animate-pulse"></div>
          <span class="text-xs block mx-auto text-center mt-1">Conquista 4</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.avatar-container:hover .avatar-glow {
  width: 95%;
  height: 80%;
  opacity: 1;
  filter: blur(32px);
  transform: translateX(-50%) scale(1.15);
}

.avatar-glow {
  position: absolute;
  bottom: 10%;
  left: 50%;
  transform: translateX(-50%);
  width: 80%;
  height: 65%;

  background: radial-gradient(ellipse at center,
      rgba(168, 130, 255, 0.35) 0%,
      rgba(100, 80, 200, 0.18) 45%,
      transparent 75%);

  filter: blur(18px);
  border-radius: 50%;
  pointer-events: none;
  z-index: 0;

  animation: pulse-glow 3s ease-in-out infinite;
  transition: all 0.35s ease;
}

@keyframes pulse-glow {

  0%,
  100% {
    opacity: 0.75;
    transform: translateX(-50%) scale(1);
  }

  50% {
    opacity: 1;
    transform: translateX(-50%) scale(1.06);
  }
}
</style>