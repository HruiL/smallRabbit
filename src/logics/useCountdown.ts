export default function useCountdown() {
  // 初始秒数
  const count = ref(60);
  // useIntervalFn 开启倒计时
  const { resume, pause, isActive } = useIntervalFn(
    () => {
      // 如果秒数大于0，递减
      if (count.value > 0) {
        count.value--;
        // 否则停止定时器
      } else {
        pause();
      }
    },
    1000,
    // 不需要立即执行定时器，点击发送短信的按钮时才调用定时器
    { immediate: false }
  );
  // 开启倒计时，接受倒计时秒数
  const start = (seconds: number) => {
    // 如果正在执行倒计时，阻止程序继续开启倒计时
    if (isActive.value) return;
    // 重置倒计时秒数
    count.value = seconds;
    // 开启倒计时
    resume();
  };
  // 返回数据供外界使用
  // count 显示的倒计时秒数
  // start 开启倒计时
  // isActive 判断是显示倒计时，还是显示发送验证码
  return { start, count, isActive };
}
