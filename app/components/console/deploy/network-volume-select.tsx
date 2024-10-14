import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@radix-ui/react-select";
import { PiHardDrivesFill } from "react-icons/pi";

export default function SelectNetworkVolumn() {
  return (
    <Select>
      <SelectTrigger className="w-[180px]">
        <div className="flex flex-inline items-center gap-2">
          <PiHardDrivesFill />
          <SelectValue placeholder={`Network Volume`} />
        </div>
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value="any">
            <div className="flex items-center gap-2">Network Volume</div>
          </SelectItem>
          <SelectItem value="baidu-bj">
            <div className="flex items-center gap-2">Baidu Beijing</div>
          </SelectItem>
          <SelectItem value="Volcengine-bj">
            <div className="flex items-center gap-2">Volcengine Beijing</div>
          </SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
