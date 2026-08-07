#!/bin/zsh

set -euo pipefail

script_dir="${0:A:h}"
project_dir="${script_dir:h}"
output_dir="$project_dir/public/audio/voice"
temporary_dir="$(mktemp -d /private/tmp/paceforge-voice.XXXXXX)"

trap 'rm -rf "$temporary_dir"' EXIT
mkdir -p "$output_dir"

generate_voice() {
  local filename="$1"
  local message="$2"
  local aiff_file="$temporary_dir/$filename.aiff"

  say -v Yuna -r 230 -o "$aiff_file" "$message"
  afconvert "$aiff_file" "$output_dir/$filename.wav" -f WAVE -d LEI16@22050
}

generate_voice "prep" "운동을 시작합니다. 준비하세요."
generate_voice "rest" "휴식입니다."
generate_voice "set" "다음 세트 시작입니다."
generate_voice "custom" "다음 운동을 시작합니다."
generate_voice "emom" "다음 인터벌을 시작합니다."
generate_voice "fortime" "포 타임 시작입니다."
generate_voice "amrap" "에이맵 시작입니다."
generate_voice "warning" "십 초 후 시작합니다. 준비하세요."
generate_voice "paused" "일시정지했습니다."
generate_voice "resume" "계속합니다."
generate_voice "timecap" "타임캡입니다. 운동을 종료합니다."
generate_voice "complete" "운동이 종료되었습니다. 수고하셨습니다."
generate_voice "output-test" "스피커 연결이 정상입니다."

generate_voice "hyrox-01" "런 일. 일 킬로미터 시작입니다."
generate_voice "hyrox-02" "스키 에르그. 천 미터 시작입니다."
generate_voice "hyrox-03" "런 이. 일 킬로미터 시작입니다."
generate_voice "hyrox-04" "슬레드 푸시. 오십 미터 시작입니다."
generate_voice "hyrox-05" "런 삼. 일 킬로미터 시작입니다."
generate_voice "hyrox-06" "슬레드 풀. 오십 미터 시작입니다."
generate_voice "hyrox-07" "런 사. 일 킬로미터 시작입니다."
generate_voice "hyrox-08" "버피 브로드 점프. 팔십 미터 시작입니다."
generate_voice "hyrox-09" "런 오. 일 킬로미터 시작입니다."
generate_voice "hyrox-10" "로우. 천 미터 시작입니다."
generate_voice "hyrox-11" "런 육. 일 킬로미터 시작입니다."
generate_voice "hyrox-12" "파머스 캐리. 이백 미터 시작입니다."
generate_voice "hyrox-13" "런 칠. 일 킬로미터 시작입니다."
generate_voice "hyrox-14" "샌드백 런지. 백 미터 시작입니다."
generate_voice "hyrox-15" "런 팔. 일 킬로미터 시작입니다."
generate_voice "hyrox-16" "월 볼. 백 회 시작입니다."

echo "Generated PACEFORGE Korean voice assets in $output_dir"
