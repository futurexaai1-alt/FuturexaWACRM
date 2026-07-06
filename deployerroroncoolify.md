2026-Jun-23 14:42:05.271988 Docker 29.5.2 with BuildKit and Buildx detected on deployment server (localhost).
2026-Jun-23 14:42:05.296957 Starting deployment of futurexaai1-alt/FuturexaWACRM:main to localhost.
2026-Jun-23 14:42:05.695814 Preparing container with helper image: ghcr.io/coollabsio/coolify-helper:1.0.14
2026-Jun-23 14:42:06.020498 [DEBUG] [CMD]: docker stop --time=30 kwyqhnkjk4q4vyc9d5whzcjo
2026-Jun-23 14:42:06.020498 [DEBUG] Flag --time has been deprecated, use --timeout instead
2026-Jun-23 14:42:06.027889 [DEBUG] Error response from daemon: No such container: kwyqhnkjk4q4vyc9d5whzcjo
2026-Jun-23 14:42:06.526405 [DEBUG] [CMD]: docker run -d --network 'coolify' --name kwyqhnkjk4q4vyc9d5whzcjo  --rm -v /var/run/docker.sock:/var/run/docker.sock ghcr.io/coollabsio/coolify-helper:1.0.14
2026-Jun-23 14:42:06.526405 [DEBUG] 82f0dc9f70c3f6ae8df1be07a27b8131ac679037d1c333b52c578479eae63051
2026-Jun-23 14:42:09.749229 [DEBUG] [CMD]: docker exec kwyqhnkjk4q4vyc9d5whzcjo bash -c 'GIT_SSH_COMMAND="ssh -o ConnectTimeout=30 -p 22 -o Port=22 -o LogLevel=ERROR -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null" git ls-remote https://x-access-token:<REDACTED>@github.com/futurexaai1-alt/FuturexaWACRM.git refs/heads/main'
2026-Jun-23 14:42:09.749229 [DEBUG] 12438dca780e87449ba93687cd51de26a8357087	refs/heads/main
2026-Jun-23 14:42:10.044591 Image not found (wmysh2u2ne3i4amwlaa09d6k:12438dca780e87449ba93687cd51de26a8357087). Building new image.
2026-Jun-23 14:42:10.339205 ----------------------------------------
2026-Jun-23 14:42:10.359730 Importing futurexaai1-alt/FuturexaWACRM:main (commit sha 12438dca780e87449ba93687cd51de26a8357087) to /artifacts/kwyqhnkjk4q4vyc9d5whzcjo.
2026-Jun-23 14:42:10.721022 [DEBUG] [CMD]: docker exec kwyqhnkjk4q4vyc9d5whzcjo bash -c 'git clone --depth=1 --recurse-submodules --shallow-submodules -b '\''main'\'' '\''https://x-access-token:<REDACTED>@github.com/futurexaai1-alt/FuturexaWACRM.git'\'' '\''/artifacts/kwyqhnkjk4q4vyc9d5whzcjo'\'' && cd '\''/artifacts/kwyqhnkjk4q4vyc9d5whzcjo'\'' && GIT_SSH_COMMAND="ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null" git fetch --depth=1 origin '\''12438dca780e87449ba93687cd51de26a8357087'\'' && git -c advice.detachedHead=false checkout '\''12438dca780e87449ba93687cd51de26a8357087'\'' >/dev/null 2>&1 && cd '\''/artifacts/kwyqhnkjk4q4vyc9d5whzcjo'\'' && if [ -f .gitmodules ]; then git submodule sync && GIT_SSH_COMMAND="ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null" git submodule update --init --recursive --depth=1; fi && cd '\''/artifacts/kwyqhnkjk4q4vyc9d5whzcjo'\'' && GIT_SSH_COMMAND="ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null" git lfs pull'
2026-Jun-23 14:42:10.721022 [DEBUG] Cloning into '/artifacts/kwyqhnkjk4q4vyc9d5whzcjo'...
2026-Jun-23 14:42:12.320114 [DEBUG] From https://github.com/futurexaai1-alt/FuturexaWACRM
2026-Jun-23 14:<REDACTED>@sha256:d45c89d80e13d7ad0fd555b5130f22a866d9dd10e861f589932303ef2314c7de
2026-Jun-23 14:42:21.748569 [DEBUG] #4 resolve ghcr.io/railwayapp/nixpacks:ubuntu-1745885067@sha256:d45c89d80e13d7ad0fd555b5130f22a866d9dd10e861f589932303ef2314c7de 0.1s done
2026-Jun-23 14:42:22.054314 [DEBUG] #4 ...
2026-Jun-23 14:42:22.054314 [DEBUG] 
2026-Jun-23 14:42:22.054314 [DEBUG] #5 [internal] load build context
2026-Jun-23 14:42:22.054314 [DEBUG] #5 transferring context: 2.89MB 0.2s done
2026-Jun-23 14:42:22.054314 [DEBUG] #5 DONE 0.2s
2026-Jun-23 14:42:22.054314 [DEBUG] 
2026-Jun-23 14:42:22.054314 [DEBUG] #4 [stage-0  1/11] FROM ghcr.io/railwayapp/nixpacks:ubuntu-1745885067@sha256:d45c89d80e13d7ad0fd555b5130f22a866d9dd10e861f589932303ef2314c7de
2026-Jun-23 14:42:22.107967 [DEBUG] #4 sha256:b65af0a51d863b994ae8e73f3b739ad2c14c4ab0f3b8807c7baf25404b897c06 0B / 75.95MB 0.2s
2026-Jun-23 14:42:22.107967 [DEBUG] #4 sha256:7962e2b983fd33a26ed1c6cd3dc8130d909d793c6a76893ed532f122edf72913 0B / 33.30MB 0.2s
2026-Jun-23 14:42:22.237987 [DEBUG] #4 sha256:b65af0a51d863b994ae8e73f3b739ad2c14c4ab0f3b8807c7baf25404b897c06 4.19MB / 75.95MB 0.3s
2026-Jun-23 14:42:22.237987 [DEBUG] #4 sha256:2726e237d1a374379e783053d93d0345c8a3bf3c57b5d35b099de1ad777486ee 0B / 29.72MB 0.2s
2026-Jun-23 14:42:22.387310 [DEBUG] #4 sha256:b65af0a51d863b994ae8e73f3b739ad2c14c4ab0f3b8807c7baf25404b897c06 8.39MB / 75.95MB 0.5s
2026-Jun-23 14:42:22.539458 [DEBUG] #4 sha256:b65af0a51d863b994ae8e73f3b739ad2c14c4ab0f3b8807c7baf25404b897c06 12.58MB / 75.95MB 0.6s
2026-Jun-23 14:42:22.687000 [DEBUG] #4 sha256:b65af0a51d863b994ae8e73f3b739ad2c14c4ab0f3b8807c7baf25404b897c06 16.78MB / 75.95MB 0.8s
2026-Jun-23 14:42:22.837807 [DEBUG] #4 sha256:b65af0a51d863b994ae8e73f3b739ad2c14c4ab0f3b8807c7baf25404b897c06 20.97MB / 75.95MB 0.9s
2026-Jun-23 14:42:22.837807 [DEBUG] #4 sha256:7962e2b983fd33a26ed1c6cd3dc8130d909d793c6a76893ed532f122edf72913 2.10MB / 33.30MB 0.8s
2026-Jun-23 14:42:22.996551 [DEBUG] #4 sha256:2726e237d1a374379e783053d93d0345c8a3bf3c57b5d35b099de1ad777486ee 2.10MB / 29.72MB 0.9s
2026-Jun-23 14:42:23.145738 [DEBUG] #4 sha256:b65af0a51d863b994ae8e73f3b739ad2c14c4ab0f3b8807c7baf25404b897c06 28.60MB / 75.95MB 1.2s
2026-Jun-23 14:42:23.306411 [DEBUG] #4 sha256:b65af0a51d863b994ae8e73f3b739ad2c14c4ab0f3b8807c7baf25404b897c06 33.44MB / 75.95MB 1.4s
2026-Jun-23 14:42:23.306411 [DEBUG] #4 sha256:7962e2b983fd33a26ed1c6cd3dc8130d909d793c6a76893ed532f122edf72913 4.19MB / 33.30MB 1.2s
2026-Jun-23 14:42:23.439830 [DEBUG] #4 sha256:2726e237d1a374379e783053d93d0345c8a3bf3c57b5d35b099de1ad777486ee 4.19MB / 29.72MB 1.4s
2026-Jun-23 14:42:23.592516 [DEBUG] #4 sha256:b65af0a51d863b994ae8e73f3b739ad2c14c4ab0f3b8807c7baf25404b897c06 37.38MB / 75.95MB 1.7s
2026-Jun-23 14:42:23.739583 [DEBUG] #4 sha256:b65af0a51d863b994ae8e73f3b739ad2c14c4ab0f3b8807c7baf25404b897c06 43.59MB / 75.95MB 1.8s
2026-Jun-23 14:42:23.739583 [DEBUG] #4 sha256:2726e237d1a374379e783053d93d0345c8a3bf3c57b5d35b099de1ad777486ee 6.29MB / 29.72MB 1.7s
2026-Jun-23 14:42:23.892594 [DEBUG] #4 sha256:b65af0a51d863b994ae8e73f3b739ad2c14c4ab0f3b8807c7baf25404b897c06 49.28MB / 75.95MB 2.0s
2026-Jun-23 14:42:23.892594 [DEBUG] #4 sha256:7962e2b983fd33a26ed1c6cd3dc8130d909d793c6a76893ed532f122edf72913 6.29MB / 33.30MB 1.8s
2026-Jun-23 14:42:24.040760 [DEBUG] #4 sha256:b65af0a51d863b994ae8e73f3b739ad2c14c4ab0f3b8807c7baf25404b897c06 53.48MB / 75.95MB 2.1s
2026-Jun-23 14:42:24.040760 [DEBUG] #4 sha256:2726e237d1a374379e783053d93d0345c8a3bf3c57b5d35b099de1ad777486ee 8.39MB / 29.72MB 2.0s
2026-Jun-23 14:42:24.340664 [DEBUG] #4 sha256:b65af0a51d863b994ae8e73f3b739ad2c14c4ab0f3b8807c7baf25404b897c06 60.43MB / 75.95MB 2.4s
2026-Jun-23 14:42:24.487218 [DEBUG] #4 sha256:b65af0a51d863b994ae8e73f3b739ad2c14c4ab0f3b8807c7baf25404b897c06 64.86MB / 75.95MB 2.6s
2026-Jun-23 14:42:24.487218 [DEBUG] #4 sha256:7962e2b983fd33a26ed1c6cd3dc8130d909d793c6a76893ed532f122edf72913 8.39MB / 33.30MB 2.4s
2026-Jun-23 14:42:24.487218 [DEBUG] #4 sha256:2726e237d1a374379e783053d93d0345c8a3bf3c57b5d35b099de1ad777486ee 10.49MB / 29.72MB 2.4s
2026-Jun-23 14:42:24.635392 [DEBUG] #4 sha256:b65af0a51d863b994ae8e73f3b739ad2c14c4ab0f3b8807c7baf25404b897c06 70.25MB / 75.95MB 2.7s
2026-Jun-23 14:42:24.786734 [DEBUG] #4 sha256:2726e237d1a374379e783053d93d0345c8a3bf3c57b5d35b099de1ad777486ee 12.58MB / 29.72MB 2.7s
2026-Jun-23 14:42:24.949975 [DEBUG] #4 sha256:b65af0a51d863b994ae8e73f3b739ad2c14c4ab0f3b8807c7baf25404b897c06 75.95MB / 75.95MB 3.0s
2026-Jun-23 14:42:25.101746 [DEBUG] #4 sha256:b65af0a51d863b994ae8e73f3b739ad2c14c4ab0f3b8807c7baf25404b897c06 75.95MB / 75.95MB 3.1s done
2026-Jun-23 14:42:25.101746 [DEBUG] #4 sha256:7962e2b983fd33a26ed1c6cd3dc8130d909d793c6a76893ed532f122edf72913 10.49MB / 33.30MB 3.0s
2026-Jun-23 14:42:25.101746 [DEBUG] #4 sha256:2726e237d1a374379e783053d93d0345c8a3bf3c57b5d35b099de1ad777486ee 15.29MB / 29.72MB 3.0s
2026-Jun-23 14:42:25.250832 [DEBUG] #4 sha256:7962e2b983fd33a26ed1c6cd3dc8130d909d793c6a76893ed532f122edf72913 13.63MB / 33.30MB 3.3s
2026-Jun-23 14:42:25.400543 [DEBUG] #4 sha256:7962e2b983fd33a26ed1c6cd3dc8130d909d793c6a76893ed532f122edf72913 15.73MB / 33.30MB 3.5s
2026-Jun-23 14:42:25.400543 [DEBUG] #4 sha256:2726e237d1a374379e783053d93d0345c8a3bf3c57b5d35b099de1ad777486ee 18.00MB / 29.72MB 3.3s
2026-Jun-23 14:42:25.552447 [DEBUG] #4 sha256:7962e2b983fd33a26ed1c6cd3dc8130d909d793c6a76893ed532f122edf72913 17.83MB / 33.30MB 3.6s
2026-Jun-23 14:42:25.552447 [DEBUG] #4 sha256:2726e237d1a374379e783053d93d0345c8a3bf3c57b5d35b099de1ad777486ee 22.02MB / 29.72MB 3.5s
2026-Jun-23 14:42:25.699685 [DEBUG] #4 sha256:7962e2b983fd33a26ed1c6cd3dc8130d909d793c6a76893ed532f122edf72913 19.92MB / 33.30MB 3.8s
2026-Jun-23 14:42:25.699685 [DEBUG] #4 sha256:2726e237d1a374379e783053d93d0345c8a3bf3c57b5d35b099de1ad777486ee 25.17MB / 29.72MB 3.6s
2026-Jun-23 14:42:25.812343 [DEBUG] #4 sha256:2726e237d1a374379e783053d93d0345c8a3bf3c57b5d35b099de1ad777486ee 29.72MB / 29.72MB 3.8s done
2026-Jun-23 14:42:25.812343 [DEBUG] #4 extracting sha256:2726e237d1a374379e783053d93d0345c8a3bf3c57b5d35b099de1ad777486ee
2026-Jun-23 14:42:25.998098 [DEBUG] #4 sha256:7962e2b983fd33a26ed1c6cd3dc8130d909d793c6a76893ed532f122edf72913 26.21MB / 33.30MB 4.1s
2026-Jun-23 14:42:26.150675 [DEBUG] #4 sha256:7962e2b983fd33a26ed1c6cd3dc8130d909d793c6a76893ed532f122edf72913 29.36MB / 33.30MB 4.2s
2026-Jun-23 14:42:26.298931 [DEBUG] #4 sha256:7962e2b983fd33a26ed1c6cd3dc8130d909d793c6a76893ed532f122edf72913 32.51MB / 33.30MB 4.4s
2026-Jun-23 14:42:26.542977 [DEBUG] #4 sha256:7962e2b983fd33a26ed1c6cd3dc8130d909d793c6a76893ed532f122edf72913 33.30MB / 33.30MB 4.4s done
2026-Jun-23 14:42:28.740952 [DEBUG] #4 extracting sha256:2726e237d1a374379e783053d93d0345c8a3bf3c57b5d35b099de1ad777486ee 2.9s done
2026-Jun-23 14:42:28.740952 [DEBUG] #4 DONE 7.1s
2026-Jun-23 14:42:28.889889 [DEBUG] #4 [stage-0  1/11] FROM ghcr.io/railwayapp/nixpacks:ubuntu-1745885067@sha256:d45c89d80e13d7ad0fd555b5130f22a866d9dd10e861f589932303ef2314c7de
2026-Jun-23 14:42:28.889889 [DEBUG] #4 extracting sha256:7962e2b983fd33a26ed1c6cd3dc8130d909d793c6a76893ed532f122edf72913
2026-Jun-23 14:42:33.420086 [DEBUG] #4 extracting sha256:7962e2b983fd33a26ed1c6cd3dc8130d909d793c6a76893ed532f122edf72913 4.7s done
2026-Jun-23 14:42:33.420086 [DEBUG] #4 DONE 11.8s
2026-Jun-23 14:42:33.574451 [DEBUG] #4 [stage-0  1/11] FROM ghcr.io/railwayapp/nixpacks:ubuntu-1745885067@sha256:d45c89d80e13d7ad0fd555b5130f22a866d9dd10e861f589932303ef2314c7de
2026-Jun-23 14:42:33.574451 [DEBUG] #4 extracting sha256:b65af0a51d863b994ae8e73f3b739ad2c14c4ab0f3b8807c7baf25404b897c06
2026-Jun-23 14:42:37.704229 [DEBUG] #4 extracting sha256:b65af0a51d863b994ae8e73f3b739ad2c14c4ab0f3b8807c7baf25404b897c06 4.3s done
2026-Jun-23 14:42:37.704229 [DEBUG] #4 DONE 16.1s
2026-Jun-23 14:42:37.885700 [DEBUG] #4 [stage-0  1/11] FROM ghcr.io/railwayapp/nixpacks:ubuntu-1745885067@sha256:d45c89d80e13d7ad0fd555b5130f22a866d9dd10e861f589932303ef2314c7de
2026-Jun-23 14:42:37.885700 [DEBUG] #4 extracting sha256:866b26ac4e4722aa6bd512e1e0c5fa91657dc060ef3eebbbcbd6057625e8f518 0.0s done
2026-Jun-23 14:42:37.885700 [DEBUG] #4 DONE 16.1s
2026-Jun-23 14:42:37.885700 [DEBUG] 
2026-Jun-23 14:42:37.885700 [DEBUG] #6 [stage-0  2/11] WORKDIR /app/
2026-Jun-23 14:42:38.234132 [DEBUG] #6 DONE 0.5s
2026-Jun-23 14:42:38.398429 [DEBUG] #7 [stage-0  3/11] COPY .nixpacks/nixpkgs-23f9169c4ccce521379e602cc82ed873a1f1b52b.nix .nixpacks/nixpkgs-23f9169c4ccce521379e602cc82ed873a1f1b52b.nix
2026-Jun-23 14:42:38.452900 [DEBUG] #7 DONE 0.2s
2026-Jun-23 14:42:38.607359 [DEBUG] #8 [stage-0  4/11] RUN nix-env -if .nixpacks/nixpkgs-23f9169c4ccce521379e602cc82ed873a1f1b52b.nix && nix-collect-garbage -d
2026-Jun-23 14:42:38.831926 [DEBUG] #8 0.373 unpacking 'https://github.com/NixOS/nixpkgs/archive/23f9169c4ccce521379e602cc82ed873a1f1b52b.tar.gz' into the Git cache...
2026-Jun-23 14:<REDACTED>@1.0.0: Use your platform's native DOMException instead
2026-Jun-23 14:45:56.369659 [DEBUG] #11 50.91
2026-Jun-23 14:45:56.369659 [DEBUG] #11 50.91 added 680 packages, and audited 681 packages in 50s
2026-Jun-23 14:45:56.369659 [DEBUG] #11 50.91
2026-Jun-23 14:45:56.369659 [DEBUG] #11 50.91 245 packages are looking for funding
2026-Jun-23 14:45:56.369659 [DEBUG] #11 50.91   run `npm fund` for details
2026-Jun-23 14:45:56.516247 [DEBUG] #11 50.91
2026-Jun-23 14:45:56.516247 [DEBUG] #11 50.91 found 0 vulnerabilities
2026-Jun-23 14:45:57.891591 [DEBUG] #11 DONE 52.4s
2026-Jun-23 14:45:58.045200 [DEBUG] #12 [stage-0  8/11] COPY . /app/.
2026-Jun-23 14:45:59.244939 [DEBUG] #12 DONE 1.4s
2026-Jun-23 14:45:59.403172 [DEBUG] #13 [stage-0  9/11] RUN --mount=type=cache,id=wmysh2u2ne3i4amwlaa09d6k-next/cache,target=/app/.next/cache --mount=type=cache,id=wmysh2u2ne3i4amwlaa09d6k-node_modules/cache,target=/app/node_modules/.cache npm run build
2026-Jun-23 14:45:59.815866 [DEBUG] #13 0.568 npm warn config production Use `--omit=dev` instead.
2026-Jun-23 14:46:00.064499 [DEBUG] #13 0.665
2026-Jun-23 14:46:00.064499 [DEBUG] #13 0.665 > wacrm@0.2.2 build
2026-Jun-23 14:46:00.064499 [DEBUG] #13 0.665 > next build
2026-Jun-23 14:46:00.064499 [DEBUG] #13 0.665
2026-Jun-23 14:46:00.895796 [DEBUG] #13 1.613 Attention: Next.js now collects completely anonymous telemetry regarding usage.
2026-Jun-23 14:46:00.895796 [DEBUG] #13 1.621 This information is used to shape Next.js' roadmap and prioritize features.
2026-Jun-23 14:46:00.895796 [DEBUG] #13 1.621 You can learn more, including how to opt-out if you'd not like to participate in this anonymous program, by visiting the following URL:
2026-Jun-23 14:46:00.895796 [DEBUG] #13 1.621 https://nextjs.org/telemetry
2026-Jun-23 14:<REDACTED>@supabase/ssr: Your project's URL and API key are required to create a Supabase client!
2026-Jun-23 14:46:57.457799 [DEBUG] #13 58.10
2026-Jun-23 14:46:57.457799 [DEBUG] #13 58.10 Check your Supabase project's API settings to find these values
2026-Jun-23 14:46:57.457799 [DEBUG] #13 58.10
2026-Jun-23 14:46:57.457799 [DEBUG] #13 58.10 https://supabase.com/dashboard/project/_/settings/api
2026-Jun-23 14:<REDACTED>@sha256:d45c89d80e13d7ad0fd555b5130f22a866d9dd10e861f589932303ef2314c7de
2026-Jun-23 14:46:58.509386 #4 resolve ghcr.io/railwayapp/nixpacks:ubuntu-1745885067@sha256:d45c89d80e13d7ad0fd555b5130f22a866d9dd10e861f589932303ef2314c7de 0.1s done
2026-Jun-23 14:46:58.509386 #4 ...
2026-Jun-23 14:46:58.509386 
2026-Jun-23 14:46:58.509386 #5 [internal] load build context
2026-Jun-23 14:46:58.509386 #5 transferring context: 2.89MB 0.2s done
2026-Jun-23 14:46:58.509386 #5 DONE 0.2s
2026-Jun-23 14:46:58.509386 
2026-Jun-23 14:46:58.509386 #4 [stage-0  1/11] FROM ghcr.io/railwayapp/nixpacks:ubuntu-1745885067@sha256:d45c89d80e13d7ad0fd555b5130f22a866d9dd10e861f589932303ef2314c7de
2026-Jun-23 14:46:58.509386 #4 sha256:b65af0a51d863b994ae8e73f3b739ad2c14c4ab0f3b8807c7baf25404b897c06 0B / 75.95MB 0.2s
2026-Jun-23 14:46:58.509386 #4 sha256:7962e2b983fd33a26ed1c6cd3dc8130d909d793c6a76893ed532f122edf72913 0B / 33.30MB 0.2s
2026-Jun-23 14:46:58.509386 #4 sha256:b65af0a51d863b994ae8e73f3b739ad2c14c4ab0f3b8807c7baf25404b897c06 4.19MB / 75.95MB 0.3s
2026-Jun-23 14:46:58.509386 #4 sha256:2726e237d1a374379e783053d93d0345c8a3bf3c57b5d35b099de1ad777486ee 0B / 29.72MB 0.2s
2026-Jun-23 14:46:58.509386 #4 sha256:b65af0a51d863b994ae8e73f3b739ad2c14c4ab0f3b8807c7baf25404b897c06 8.39MB / 75.95MB 0.5s
2026-Jun-23 14:46:58.509386 #4 sha256:b65af0a51d863b994ae8e73f3b739ad2c14c4ab0f3b8807c7baf25404b897c06 12.58MB / 75.95MB 0.6s
2026-Jun-23 14:46:58.509386 #4 sha256:b65af0a51d863b994ae8e73f3b739ad2c14c4ab0f3b8807c7baf25404b897c06 16.78MB / 75.95MB 0.8s
2026-Jun-23 14:46:58.509386 #4 sha256:b65af0a51d863b994ae8e73f3b739ad2c14c4ab0f3b8807c7baf25404b897c06 20.97MB / 75.95MB 0.9s
2026-Jun-23 14:46:58.509386 #4 sha256:7962e2b983fd33a26ed1c6cd3dc8130d909d793c6a76893ed532f122edf72913 2.10MB / 33.30MB 0.8s
2026-Jun-23 14:46:58.509386 #4 sha256:2726e237d1a374379e783053d93d0345c8a3bf3c57b5d35b099de1ad777486ee 2.10MB / 29.72MB 0.9s
2026-Jun-23 14:46:58.509386 #4 sha256:b65af0a51d863b994ae8e73f3b739ad2c14c4ab0f3b8807c7baf25404b897c06 28.60MB / 75.95MB 1.2s
2026-Jun-23 14:46:58.509386 #4 sha256:b65af0a51d863b994ae8e73f3b739ad2c14c4ab0f3b8807c7baf25404b897c06 33.44MB / 75.95MB 1.4s
2026-Jun-23 14:46:58.509386 #4 sha256:7962e2b983fd33a26ed1c6cd3dc8130d909d793c6a76893ed532f122edf72913 4.19MB / 33.30MB 1.2s
2026-Jun-23 14:46:58.509386 #4 sha256:2726e237d1a374379e783053d93d0345c8a3bf3c57b5d35b099de1ad777486ee 4.19MB / 29.72MB 1.4s
2026-Jun-23 14:46:58.509386 #4 sha256:b65af0a51d863b994ae8e73f3b739ad2c14c4ab0f3b8807c7baf25404b897c06 37.38MB / 75.95MB 1.7s
2026-Jun-23 14:46:58.509386 #4 sha256:b65af0a51d863b994ae8e73f3b739ad2c14c4ab0f3b8807c7baf25404b897c06 43.59MB / 75.95MB 1.8s
2026-Jun-23 14:46:58.509386 #4 sha256:2726e237d1a374379e783053d93d0345c8a3bf3c57b5d35b099de1ad777486ee 6.29MB / 29.72MB 1.7s
2026-Jun-23 14:46:58.509386 #4 sha256:b65af0a51d863b994ae8e73f3b739ad2c14c4ab0f3b8807c7baf25404b897c06 49.28MB / 75.95MB 2.0s
2026-Jun-23 14:46:58.509386 #4 sha256:7962e2b983fd33a26ed1c6cd3dc8130d909d793c6a76893ed532f122edf72913 6.29MB / 33.30MB 1.8s
2026-Jun-23 14:46:58.509386 #4 sha256:b65af0a51d863b994ae8e73f3b739ad2c14c4ab0f3b8807c7baf25404b897c06 53.48MB / 75.95MB 2.1s
2026-Jun-23 14:46:58.509386 #4 sha256:2726e237d1a374379e783053d93d0345c8a3bf3c57b5d35b099de1ad777486ee 8.39MB / 29.72MB 2.0s
2026-Jun-23 14:46:58.509386 #4 sha256:b65af0a51d863b994ae8e73f3b739ad2c14c4ab0f3b8807c7baf25404b897c06 60.43MB / 75.95MB 2.4s
2026-Jun-23 14:46:58.509386 #4 sha256:b65af0a51d863b994ae8e73f3b739ad2c14c4ab0f3b8807c7baf25404b897c06 64.86MB / 75.95MB 2.6s
2026-Jun-23 14:46:58.509386 #4 sha256:7962e2b983fd33a26ed1c6cd3dc8130d909d793c6a76893ed532f122edf72913 8.39MB / 33.30MB 2.4s
2026-Jun-23 14:46:58.509386 #4 sha256:2726e237d1a374379e783053d93d0345c8a3bf3c57b5d35b099de1ad777486ee 10.49MB / 29.72MB 2.4s
2026-Jun-23 14:46:58.509386 #4 sha256:b65af0a51d863b994ae8e73f3b739ad2c14c4ab0f3b8807c7baf25404b897c06 70.25MB / 75.95MB 2.7s
2026-Jun-23 14:46:58.509386 #4 sha256:2726e237d1a374379e783053d93d0345c8a3bf3c57b5d35b099de1ad777486ee 12.58MB / 29.72MB 2.7s
2026-Jun-23 14:46:58.509386 #4 sha256:b65af0a51d863b994ae8e73f3b739ad2c14c4ab0f3b8807c7baf25404b897c06 75.95MB / 75.95MB 3.0s
2026-Jun-23 14:46:58.509386 #4 sha256:b65af0a51d863b994ae8e73f3b739ad2c14c4ab0f3b8807c7baf25404b897c06 75.95MB / 75.95MB 3.1s done
2026-Jun-23 14:46:58.509386 #4 sha256:7962e2b983fd33a26ed1c6cd3dc8130d909d793c6a76893ed532f122edf72913 10.49MB / 33.30MB 3.0s
2026-Jun-23 14:46:58.509386 #4 sha256:2726e237d1a374379e783053d93d0345c8a3bf3c57b5d35b099de1ad777486ee 15.29MB / 29.72MB 3.0s
2026-Jun-23 14:46:58.509386 #4 sha256:7962e2b983fd33a26ed1c6cd3dc8130d909d793c6a76893ed532f122edf72913 13.63MB / 33.30MB 3.3s
2026-Jun-23 14:46:58.509386 #4 sha256:7962e2b983fd33a26ed1c6cd3dc8130d909d793c6a76893ed532f122edf72913 15.73MB / 33.30MB 3.5s
2026-Jun-23 14:46:58.509386 #4 sha256:2726e237d1a374379e783053d93d0345c8a3bf3c57b5d35b099de1ad777486ee 18.00MB / 29.72MB 3.3s
2026-Jun-23 14:46:58.509386 #4 sha256:7962e2b983fd33a26ed1c6cd3dc8130d909d793c6a76893ed532f122edf72913 17.83MB / 33.30MB 3.6s
2026-Jun-23 14:46:58.509386 #4 sha256:2726e237d1a374379e783053d93d0345c8a3bf3c57b5d35b099de1ad777486ee 22.02MB / 29.72MB 3.5s
2026-Jun-23 14:46:58.509386 #4 sha256:7962e2b983fd33a26ed1c6cd3dc8130d909d793c6a76893ed532f122edf72913 19.92MB / 33.30MB 3.8s
2026-Jun-23 14:46:58.509386 #4 sha256:2726e237d1a374379e783053d93d0345c8a3bf3c57b5d35b099de1ad777486ee 25.17MB / 29.72MB 3.6s
2026-Jun-23 14:46:58.509386 #4 sha256:2726e237d1a374379e783053d93d0345c8a3bf3c57b5d35b099de1ad777486ee 29.72MB / 29.72MB 3.8s done
2026-Jun-23 14:46:58.509386 #4 extracting sha256:2726e237d1a374379e783053d93d0345c8a3bf3c57b5d35b099de1ad777486ee
2026-Jun-23 14:46:58.509386 #4 sha256:7962e2b983fd33a26ed1c6cd3dc8130d909d793c6a76893ed532f122edf72913 26.21MB / 33.30MB 4.1s
2026-Jun-23 14:46:58.509386 #4 sha256:7962e2b983fd33a26ed1c6cd3dc8130d909d793c6a76893ed532f122edf72913 29.36MB / 33.30MB 4.2s
2026-Jun-23 14:46:58.509386 #4 sha256:7962e2b983fd33a26ed1c6cd3dc8130d909d793c6a76893ed532f122edf72913 32.51MB / 33.30MB 4.4s
2026-Jun-23 14:46:58.509386 #4 sha256:7962e2b983fd33a26ed1c6cd3dc8130d909d793c6a76893ed532f122edf72913 33.30MB / 33.30MB 4.4s done
2026-Jun-23 14:46:58.509386 #4 extracting sha256:2726e237d1a374379e783053d93d0345c8a3bf3c57b5d35b099de1ad777486ee 2.9s done
2026-Jun-23 14:46:58.509386 #4 DONE 7.1s
2026-Jun-23 14:46:58.509386 
2026-Jun-23 14:46:58.509386 #4 [stage-0  1/11] FROM ghcr.io/railwayapp/nixpacks:ubuntu-1745885067@sha256:d45c89d80e13d7ad0fd555b5130f22a866d9dd10e861f589932303ef2314c7de
2026-Jun-23 14:46:58.509386 #4 extracting sha256:7962e2b983fd33a26ed1c6cd3dc8130d909d793c6a76893ed532f122edf72913
2026-Jun-23 14:46:58.509386 #4 extracting sha256:7962e2b983fd33a26ed1c6cd3dc8130d909d793c6a76893ed532f122edf72913 4.7s done
2026-Jun-23 14:46:58.509386 #4 DONE 11.8s
2026-Jun-23 14:46:58.509386 
2026-Jun-23 14:46:58.509386 #4 [stage-0  1/11] FROM ghcr.io/railwayapp/nixpacks:ubuntu-1745885067@sha256:d45c89d80e13d7ad0fd555b5130f22a866d9dd10e861f589932303ef2314c7de
2026-Jun-23 14:46:58.509386 #4 extracting sha256:b65af0a51d863b994ae8e73f3b739ad2c14c4ab0f3b8807c7baf25404b897c06
2026-Jun-23 14:46:58.509386 #4 extracting sha256:b65af0a51d863b994ae8e73f3b739ad2c14c4ab0f3b8807c7baf25404b897c06 4.3s done
2026-Jun-23 14:46:58.509386 #4 DONE 16.1s
2026-Jun-23 14:46:58.509386 
2026-Jun-23 14:46:58.509386 #4 [stage-0  1/11] FROM ghcr.io/railwayapp/nixpacks:ubuntu-1745885067@sha256:d45c89d80e13d7ad0fd555b5130f22a866d9dd10e861f589932303ef2314c7de
2026-Jun-23 14:46:58.509386 #4 extracting sha256:866b26ac4e4722aa6bd512e1e0c5fa91657dc060ef3eebbbcbd6057625e8f518 0.0s done
2026-Jun-23 14:46:58.509386 #4 DONE 16.1s
2026-Jun-23 14:46:58.509386 
2026-Jun-23 14:46:58.509386 #6 [stage-0  2/11] WORKDIR /app/
2026-Jun-23 14:46:58.509386 #6 DONE 0.5s
2026-Jun-23 14:46:58.509386 
2026-Jun-23 14:46:58.509386 #7 [stage-0  3/11] COPY .nixpacks/nixpkgs-23f9169c4ccce521379e602cc82ed873a1f1b52b.nix .nixpacks/nixpkgs-23f9169c4ccce521379e602cc82ed873a1f1b52b.nix
2026-Jun-23 14:46:58.509386 #7 DONE 0.2s
2026-Jun-23 14:46:58.509386 
2026-Jun-23 14:46:58.509386 #8 [stage-0  4/11] RUN nix-env -if .nixpacks/nixpkgs-23f9169c4ccce521379e602cc82ed873a1f1b52b.nix && nix-collect-garbage -d
2026-Jun-23 14:46:58.509386 #8 0.373 unpacking 'https://github.com/NixOS/nixpkgs/archive/23f9169c4ccce521379e602cc82ed873a1f1b52b.tar.gz' into the Git cache...
2026-Jun-23 14:<REDACTED>@1.0.0: Use your platform's native DOMException instead
2026-Jun-23 14:46:58.509386 #11 50.91
2026-Jun-23 14:46:58.509386 #11 50.91 added 680 packages, and audited 681 packages in 50s
2026-Jun-23 14:46:58.509386 #11 50.91
2026-Jun-23 14:46:58.509386 #11 50.91 245 packages are looking for funding
2026-Jun-23 14:46:58.509386 #11 50.91   run `npm fund` for details
2026-Jun-23 14:46:58.509386 #11 50.91
2026-Jun-23 14:46:58.509386 #11 50.91 found 0 vulnerabilities
2026-Jun-23 14:46:58.509386 #11 DONE 52.4s
2026-Jun-23 14:46:58.509386 
2026-Jun-23 14:46:58.509386 #12 [stage-0  8/11] COPY . /app/.
2026-Jun-23 14:46:58.509386 #12 DONE 1.4s
2026-Jun-23 14:46:58.509386 
2026-Jun-23 14:46:58.509386 #13 [stage-0  9/11] RUN --mount=type=cache,id=wmysh2u2ne3i4amwlaa09d6k-next/cache,target=/app/.next/cache --mount=type=cache,id=wmysh2u2ne3i4amwlaa09d6k-node_modules/cache,target=/app/node_modules/.cache npm run build
2026-Jun-23 14:46:58.509386 #13 0.568 npm warn config production Use `--omit=dev` instead.
2026-Jun-23 14:46:58.509386 #13 0.665
2026-Jun-23 14:46:58.509386 #13 0.665 > wacrm@0.2.2 build
2026-Jun-23 14:46:58.509386 #13 0.665 > next build
2026-Jun-23 14:46:58.509386 #13 0.665
2026-Jun-23 14:46:58.509386 #13 1.613 Attention: Next.js now collects completely anonymous telemetry regarding usage.
2026-Jun-23 14:46:58.509386 #13 1.621 This information is used to shape Next.js' roadmap and prioritize features.
2026-Jun-23 14:46:58.509386 #13 1.621 You can learn more, including how to opt-out if you'd not like to participate in this anonymous program, by visiting the following URL:
2026-Jun-23 14:46:58.509386 #13 1.621 https://nextjs.org/telemetry
2026-Jun-23 14:<REDACTED>@supabase/ssr: Your project's URL and API key are required to create a Supabase client!
2026-Jun-23 14:46:58.509386 #13 58.10
2026-Jun-23 14:46:58.509386 #13 58.10 Check your Supabase project's API settings to find these values
2026-Jun-23 14:46:58.509386 #13 58.10
2026-Jun-23 14:46:58.509386 #13 58.10 https://supabase.com/dashboard/project/_/settings/api
2026-Jun-23 14:46:58.509386 #13 58.10     at <unknown> (https://supabase.com/dashboard/project/_/settings/api)
2026-Jun-23 14:46:58.509386 #13 58.10     at <unknown> (.next/server/chunks/ssr/_05ufb75._.js:55:30)
2026-Jun-23 14:46:58.509386 #13 58.10     at <unknown> (.next/server/chunks/ssr/_05ufb75._.js:59:4496)
2026-Jun-23 14:46:58.509386 #13 58.10     at <unknown> (.next/server/chunks/ssr/_0ri8h9.._.js:1:6231) {
2026-Jun-23 14:46:58.509386 #13 58.10   digest: '2657748632'
2026-Jun-23 14:46:58.509386 #13 58.10 }
2026-Jun-23 14:46:58.509386 #13 58.10 Export encountered an error on /(auth)/forgot-password/page: /forgot-password, exiting the build.
2026-Jun-23 14:46:58.509386 #13 58.21 ⨯ Next.js build worker exited with code: 1 and signal: null
2026-Jun-23 14:46:58.509386 #13 ERROR: process "/bin/bash -ol pipefail -c npm run build" did not complete successfully: exit code: 1
2026-Jun-23 14:46:58.509386 ------
2026-Jun-23 14:46:58.509386 > [stage-0  9/11] RUN --mount=type=cache,id=wmysh2u2ne3i4amwlaa09d6k-next/cache,target=/app/.next/cache --mount=type=cache,id=wmysh2u2ne3i4amwlaa09d6k-node_modules/cache,target=/app/node_modules/.cache npm run build:
2026-Jun-23 14:46:58.509386 58.10
2026-Jun-23 14:46:58.509386 58.10 https://supabase.com/dashboard/project/_/settings/api
2026-Jun-23 14:46:58.509386 58.10     at <unknown> (https://supabase.com/dashboard/project/_/settings/api)
2026-Jun-23 14:46:58.509386 58.10     at <unknown> (.next/server/chunks/ssr/_05ufb75._.js:55:30)
2026-Jun-23 14:46:58.509386 58.10     at <unknown> (.next/server/chunks/ssr/_05ufb75._.js:59:4496)
2026-Jun-23 14:46:58.509386 58.10     at <unknown> (.next/server/chunks/ssr/_0ri8h9.._.js:1:6231) {
2026-Jun-23 14:46:58.509386 58.10   digest: '2657748632'
2026-Jun-23 14:46:58.509386 58.10 }
2026-Jun-23 14:46:58.509386 58.10 Export encountered an error on /(auth)/forgot-password/page: /forgot-password, exiting the build.
2026-Jun-23 14:46:58.509386 58.21 ⨯ Next.js build worker exited with code: 1 and signal: null
2026-Jun-23 14:46:58.509386 ------
2026-Jun-23 14:46:58.509386 
2026-Jun-23 14:46:58.509386 1 warning found (use docker --debug to expand):
2026-Jun-23 14:46:58.509386 - UndefinedVar: Usage of undefined variable '$NIXPACKS_PATH' (line 18)
2026-Jun-23 14:46:58.509386 Dockerfile:24
2026-Jun-23 14:46:58.509386 --------------------
2026-Jun-23 14:46:58.509386 22 |     # build phase
2026-Jun-23 14:46:58.509386 23 |     COPY . /app/.
2026-Jun-23 14:46:58.509386 24 | >>> RUN --mount=type=cache,id=wmysh2u2ne3i4amwlaa09d6k-next/cache,target=/app/.next/cache --mount=type=cache,id=wmysh2u2ne3i4amwlaa09d6k-node_modules/cache,target=/app/node_modules/.cache npm run build
2026-Jun-23 14:46:58.509386 25 |
2026-Jun-23 14:46:58.509386 26 |
2026-Jun-23 14:46:58.509386 --------------------
2026-Jun-23 14:46:58.509386 ERROR: failed to build: failed to solve: process "/bin/bash -ol pipefail -c npm run build" did not complete successfully: exit code: 1
2026-Jun-23 14:46:58.509386 exit status 1
2026-Jun-23 14:46:58.528778 [DEBUG] Error type: App\Exceptions\DeploymentException
2026-Jun-23 14:46:58.550800 [DEBUG] Error code: 0
2026-Jun-23 14:46:58.572473 [DEBUG] Location: /var/www/html/app/Traits/ExecuteRemoteCommand.php:242
2026-Jun-23 14:46:58.599506 [DEBUG] Stack trace (first 5 lines):
2026-Jun-23 14:46:58.624470 [DEBUG] #0 /var/www/html/app/Traits/ExecuteRemoteCommand.php(106): App\Jobs\ApplicationDeploymentJob->executeCommandWithProcess()
2026-Jun-23 14:46:58.645968 [DEBUG] #1 /var/www/html/vendor/laravel/framework/src/Illuminate/Collections/Traits/EnumeratesValues.php(275): App\Jobs\ApplicationDeploymentJob->{closure:App\Traits\ExecuteRemoteCommand::execute_remote_command():72}()
2026-Jun-23 14:46:58.667857 [DEBUG] #2 /var/www/html/app/Traits/ExecuteRemoteCommand.php(72): Illuminate\Support\Collection->each()
2026-Jun-23 14:46:58.690774 [DEBUG] #3 /var/www/html/app/Jobs/ApplicationDeploymentJob.php(3723): App\Jobs\ApplicationDeploymentJob->execute_remote_command()
2026-Jun-23 14:46:58.713839 [DEBUG] #4 /var/www/html/app/Jobs/ApplicationDeploymentJob.php(945): App\Jobs\ApplicationDeploymentJob->build_image()
2026-Jun-23 14:46:58.739742 ========================================
2026-Jun-23 14:46:58.759130 Deployment failed. Removing the new version of your application.
2026-Jun-23 14:46:59.803162 Gracefully shutting down build container: kwyqhnkjk4q4vyc9d5whzcjo
2026-Jun-23 14:47:00.118045 [DEBUG] [CMD]: docker stop --time=30 kwyqhnkjk4q4vyc9d5whzcjo
2026-Jun-23 14:47:00.118045 [DEBUG] Flag --time has been deprecated, use --timeout instead
2026-Jun-23 14:47:00.773030 [DEBUG] kwyqhnkjk4q4vyc9d5whzcjo